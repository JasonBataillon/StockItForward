import React, { useEffect, useState } from 'react';
import { useGetUserWatchlistQuery } from './usersSlice';

const Users = () => {
  const { data, error, isLoading } = useGetUserWatchlistQuery();
  const [username, setUsername] = useState('');
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    if (data) {
      setUsername(data.username);
      setWatchlist(data.watchlists);
    }
  }, [data]);

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
        {watchlist.map((stock) => (
          <li key={stock.id}>
            {stock.symbol} - {stock.name} - ${stock.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
