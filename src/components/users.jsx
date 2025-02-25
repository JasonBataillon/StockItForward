import React, { useEffect, useState } from 'react';
import { useGetUserWatchlistQuery } from './usersSlice';
import { fetchStockPrice } from '../api/stockUtils';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useNavigate and useLocation

const Users = () => {
  const { data, error, isLoading, refetch } = useGetUserWatchlistQuery();
  const [username, setUsername] = useState('');
  const [watchlist, setWatchlist] = useState([]);
  const [stockPrices, setStockPrices] = useState({});
  const navigate = useNavigate(); // Initialize useNavigate
  const location = useLocation(); // Initialize useLocation

  useEffect(() => {
    if (data) {
      setUsername(data.username);
      setWatchlist(data.watchlists);
    }
  }, [data]);

  useEffect(() => {
    const API_KEY = import.meta.env.VITE_POLYGON_API_KEY;
    if (!API_KEY) {
      console.error('Polygon API key is not defined');
      return;
    }

    const fetchStockPrices = async () => {
      const updatedPrices = {};
      for (const item of watchlist) {
        try {
          const cachedData = localStorage.getItem(
            `stockData_${item.stock.symbol}`
          );
          if (cachedData) {
            const parsedData = JSON.parse(cachedData);
            updatedPrices[item.stock.symbol] = parsedData.stockPrice;
          } else {
            const { stockPrice } = await fetchStockPrice(
              item.stock.symbol,
              API_KEY
            );
            if (stockPrice !== null) {
              updatedPrices[item.stock.symbol] = stockPrice;
              localStorage.setItem(
                `stockData_${item.stock.symbol}`,
                JSON.stringify({ stockPrice })
              );
            }
          }
        } catch (error) {
          console.error(error);
        }
      }
      setStockPrices(updatedPrices);
    };

    if (watchlist.length > 0) {
      fetchStockPrices();
    }

    // return () => clearInterval(interval);
  }, [watchlist, refetch]);

  useEffect(() => {
    // Trigger a refresh when the location changes
    refetch();
  }, [location, refetch]);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token from local storage
    navigate('/login'); // Redirect to the login page
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading user data</div>;
  }

  return (
    <div>
      <h1>Welcome {username}!</h1>
      <h2>Your Watchlist:</h2>
      <ul>
        {watchlist.map((item) => (
          <li key={item.id}>
            {item.stock.symbol} - {item.stock.name} - $
            {stockPrices[item.stock.symbol] || item.stock.price}
          </li>
        ))}
      </ul>
      <button onClick={handleLogout}>Logout</button> {/* Add logout button */}
    </div>
  );
};

export default Users;
