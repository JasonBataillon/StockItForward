import React, { useEffect, useState } from 'react';
import { useGetUserWatchlistQuery } from './usersSlice';
import { fetchStockPrice } from '../api/stockUtils';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useNavigate and useLocation
import './users.css'; // Import the CSS file

const Users = () => {
  const { data, error, isLoading, refetch } = useGetUserWatchlistQuery();
  const [username, setUsername] = useState('');
  const [watchlist, setWatchlist] = useState([]);
  const [stockPrices, setStockPrices] = useState({});
  const [searchQuery, setSearchQuery] = useState(''); // Add search query state
  const [hoveredStock, setHoveredStock] = useState(null); // Add state for hovered stock
  const [relatedCompanies, setRelatedCompanies] = useState([]); // Add state for related companies
  const [noRelatedCompanies, setNoRelatedCompanies] = useState(false); // Add state for no related companies
  const navigate = useNavigate(); // Initialize useNavigate
  const location = useLocation(); // Initialize useLocation
  const API_KEY = import.meta.env.VITE_POLYGON_API_KEY;

  useEffect(() => {
    if (data) {
      setUsername(data.username);
      setWatchlist(data.watchlists);
    }
  }, [data]);

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

    // return () => clearInterval(interval);
  }, [watchlist, refetch, API_KEY]);

  useEffect(() => {
    // Trigger a refresh when the location changes
    refetch();
  }, [location, refetch]);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token from local storage
    navigate('/login'); // Redirect to the login page
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

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

  const filteredWatchlist = watchlist.filter((item) =>
    item.stock.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          </li>
        ))}
      </ul>
      <button onClick={handleLogout}>Logout</button> {/* Add logout button */}
    </div>
  );
};

export default Users;
