import React, { useEffect, useState } from 'react';
import { useGetUserWatchlistQuery } from './usersSlice';
import { fetchStockPrice } from '../api/stockUtils';

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
    if (!API_KEY) {
      console.error('Polygon API key is not defined');
      return;
    }

    const fetchStockPrices = async () => {
      const updatedPrices = {};
      for (const item of watchlist) {
        try {
          const { stockPrice } = await fetchStockPrice(
            item.stock.symbol,
            API_KEY
          );
          if (stockPrice !== null) {
            updatedPrices[item.stock.symbol] = stockPrice;
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
