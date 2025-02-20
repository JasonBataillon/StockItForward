import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchStockPrice } from '../api/stockUtils';

const StockSearch = () => {
  const API_KEY = import.meta.env.VITE_POLYGON_API_KEY; // Get API key from /.env
  if (!API_KEY) {
    throw new Error('API key is missing');
  }

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false); // Boilerplate loading state
  const [error, setError] = useState(null); // Boilerplate error handling
  const [ranOnce, setRanOnce] = useState(false); // Brute force check
  const navigate = useNavigate();

  const fetchStockData = async (e) => {
    e.preventDefault();
    setError(null);
    setResults([]);
    setLoading(true); // Will just inform program is processing

    setTimeout(() => {
      setRanOnce(true);
    }, 3000); // Force delay of 3 seconds

    setRanOnce(true);

    try {
      const response = await fetch(
        `https://api.polygon.io/v3/reference/tickers?search=${query}&apiKey=${API_KEY}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const result = await response.json();
      setResults(result.results || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle stock selection
  // This function is what sends the prop to stockCharts.jsx
  const handleStockSelect = async (ticker) => {
    try {
      const { stockPrice, stockName } = await fetchStockPrice(ticker, API_KEY);
      if (stockPrice !== null) {
        console.log(`Fetched price for ${ticker}: $${stockPrice}`);
        navigate('/stockCharts', {
          state: { stockTicker: ticker, stockPrice, stockName },
        }); // Pass stock ticker, price, and name as state
      } else {
        console.error(`Failed to fetch price for ${ticker}`);
      }
    } catch (error) {
      console.error(`Error fetching price for ${ticker}:`, error);
    }
  };

  return (
    <div>
      <h2>Stock Search</h2>
      <form onSubmit={fetchStockData}>
        <input
          type="text"
          placeholder="Enter stock query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {results.length > 0 && (
        <div>
          <h3>Results:</h3>
          <ul>
            {results.map((stock) => (
              <li key={stock.ticker}>
                <strong>
                  {stock.name}
                  <button onClick={() => handleStockSelect(stock.ticker)}>
                    {stock.ticker}
                  </button>
                </strong>
              </li>
            ))}
          </ul>
        </div>
      )}
      {results.length === 0 && ranOnce && !loading && <p>No results found</p>}
    </div>
  );
};

export default StockSearch;
