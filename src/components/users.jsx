import React, { useEffect, useState } from 'react';
import { useGetUserWatchlistQuery } from './usersSlice';

const Users = () => {
  const { data, error, isLoading, refetch } = useGetUserWatchlistQuery();
  const [username, setUsername] = useState('');
  const [watchlist, setWatchlist] = useState([]);
  const [stockPrices, setStockPrices] = useState({});

  useEffect(() => {
    if (data) {
      setUsername(data.username);
      setWatchlist(data.watchlists);
    }
  }, [data]);

  useEffect(() => {
    const API_KEY = import.meta.env.VITE_POLYGON_API_KEY;
    const query = 'AAPL';
    if (!API_KEY) {
      console.error('Polygon API key is not defined');
      return;
    }

    const fetchStockPrices = async () => {
      const updatedPrices = {};
      for (const item of watchlist) {
        try {
          const response = await fetch(
            `https://api.polygon.io/v3/reference/tickers?search=AAPL}&apiKey=${API_KEY}`
          );
          if (!response.ok) {
            throw new Error(
              `Error fetching data for ${item.stock.symbol}: ${response.statusText}`
            );
          }
          const json = await response.json();
          updatedPrices[item.stock.symbol] = json.last.price;
        } catch (error) {
          console.error(error);
        }
      }
      setStockPrices(updatedPrices);
    };

    if (watchlist.length > 0) {
      fetchStockPrices();
    }

    const interval = setInterval(() => {
      refetch();
    }, 60000);

    return () => clearInterval(interval);
  }, [watchlist, refetch]);

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
    </div>
  );
};

export default Users;
