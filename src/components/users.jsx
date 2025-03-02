import React, { useEffect, useState } from 'react';
import { useGetUserWatchlistQuery } from './usersSlice';
import { fetchStockPrice } from '../api/stockUtils';
import { useNavigate, useLocation } from 'react-router-dom';
import './users.css';

const Users = () => {
  const { data, error, isLoading, refetch } = useGetUserWatchlistQuery();
  const [username, setUsername] = useState('');
  const [wallet, setWallet] = useState(0);
  const [watchlist, setWatchlist] = useState([]);
  const [ownedStocks, setOwnedStocks] = useState([]);
  const [stockPrices, setStockPrices] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredStock, setHoveredStock] = useState(null);
  const [relatedCompanies, setRelatedCompanies] = useState([]);
  const [noRelatedCompanies, setNoRelatedCompanies] = useState(false);
  const [sellAmount, setSellAmount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const API_KEY = import.meta.env.VITE_POLYGON_API_KEY;

  useEffect(() => {
    if (data) {
      setUsername(data.username);
      setWallet(data.wallet);
      setWatchlist(data.watchlists);
      setOwnedStocks(data.ownedStocks);
    }
  }, [data]);

  // Fetch stock prices for watchlist
  useEffect(() => {
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
  }, [watchlist, refetch, API_KEY]);

  // Refetch data when location changes
  useEffect(() => {
    refetch();
  }, [location, refetch]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Deleted stock from watchlist
  const handleDeleteStock = async (symbol) => {
    try {
      const response = await fetch(
        `http://localhost:3000/watchlist/${symbol}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setWatchlist(watchlist.filter((item) => item.stock.symbol !== symbol));
      localStorage.removeItem(`stockData_${symbol}`);
    } catch (error) {
      console.error('Error deleting stock from watchlist:', error);
    }
  };

  // Handle search query change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Handle mouse enter event to fetch related companies
  const handleMouseEnter = async (symbol) => {
    setHoveredStock(symbol);
    const cachedData = localStorage.getItem(`relatedCompanies_${symbol}`);
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      setRelatedCompanies(parsedData.relatedCompanies);
      setNoRelatedCompanies(parsedData.noRelatedCompanies);
    } else {
      try {
        const response = await fetch(
          `https://api.polygon.io/v1/related-companies/${symbol}?apiKey=${API_KEY}`
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const relatedCompanies = data.results || [];
        setRelatedCompanies(relatedCompanies);
        setNoRelatedCompanies(relatedCompanies.length === 0);
        localStorage.setItem(
          `relatedCompanies_${symbol}`,
          JSON.stringify({
            relatedCompanies,
            noRelatedCompanies: relatedCompanies.length === 0,
          })
        );
      } catch (error) {
        console.error('Error fetching related companies:', error);
      }
    }
  };

  const handleMouseLeave = () => {
    setHoveredStock(null);
    setRelatedCompanies([]);
    setNoRelatedCompanies(false);
  };

  const handleSellStock = async (symbol, amount) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch('http://localhost:3000/user/sell', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          symbol,
          amount,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Stock sold successfully!');
        refetch();
      } else {
        throw new Error('Failed to sell stock');
      }
    } catch (error) {
      alert('Error selling stock. Please try again.');
      console.error('Error selling stock:', error);
    }
  };

  // Filter watchlist based on search query
  const filteredWatchlist = watchlist.filter((item) =>
    item.stock.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Please log in to see your watch list.</div>;
  }

  return (
    <div>
      <h1>Welcome {username}!</h1>
      <h2>Your Wallet: ${wallet.toFixed(2)}</h2>
      <h2>Your Watchlist:</h2>
      <input
        type="text"
        placeholder="Search watchlist..."
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <ul>
        {filteredWatchlist.map((item) => (
          <li
            key={item.id}
            onMouseEnter={() => handleMouseEnter(item.stock.symbol)}
            onMouseLeave={handleMouseLeave}
          >
            {item.stock.symbol} - {item.stock.name} - $
            {stockPrices[item.stock.symbol] || item.stock.price}
            {hoveredStock === item.stock.symbol && (
              <div className="popup">
                {noRelatedCompanies ? (
                  <p>No data on related companies.</p>
                ) : (
                  <>
                    <h3>Related Companies:</h3>
                    <ul>
                      {relatedCompanies.map((company) => (
                        <li key={company.ticker}>{company.ticker}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}
            <button onClick={() => handleDeleteStock(item.stock.symbol)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
      <h2>Your Owned Stocks:</h2>
      <ul>
        {ownedStocks.map((item) => (
          <li key={item.id}>
            {item.stock.symbol} - {item.stock.name} - {item.shares} shares - $
            {stockPrices[item.stock.symbol] || item.stock.price} (
            {((stockPrices[item.stock.symbol] || item.stock.price) -
              item.avgPrice) *
              item.shares >=
            0
              ? '+'
              : '-'}
            $
            {(
              ((stockPrices[item.stock.symbol] || item.stock.price) -
                item.avgPrice) *
              item.shares
            ).toFixed(2)}
            )
            <input
              type="number"
              placeholder="Enter amount to sell"
              onChange={(e) => setSellAmount(e.target.value)}
            />
            <button
              onClick={() => handleSellStock(item.stock.symbol, sellAmount)}
            >
              Sell
            </button>
          </li>
        ))}
      </ul>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Users;
