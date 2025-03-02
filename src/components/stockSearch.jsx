import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchStockPrice } from '../api/stockUtils';

const StockSearch = () => {
  const API_KEY = import.meta.env.VITE_POLYGON_API_KEY;
  if (!API_KEY) {
    throw new Error('API key is missing');
  }

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ranOnce, setRanOnce] = useState(false);
  const [buyAmounts, setBuyAmounts] = useState({});
  const navigate = useNavigate();

  // Load cached search results on component mount
  useEffect(() => {
    const storedResults = localStorage.getItem('stockSearchResults');
    if (storedResults) {
      setResults(JSON.parse(storedResults));
    }
  }, []);

  const fetchStockData = async (e) => {
    e.preventDefault();
    setError(null);
    setResults([]);
    setLoading(true);
    setRanOnce(true);

    localStorage.removeItem('stockSearchResults');

    try {
      const response = await fetch(
        `https://api.polygon.io/v3/reference/tickers?search=${query}&apiKey=${API_KEY}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const result = await response.json();
      const fetchedResults = result.results || [];
      setResults(fetchedResults);

      localStorage.setItem(
        'stockSearchResults',
        JSON.stringify(fetchedResults)
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle stock selection and navigate to stock charts
  const handleStockSelect = async (ticker) => {
    try {
      const { stockPrice, stockName } = await fetchStockPrice(ticker, API_KEY);
      if (stockPrice !== null) {
        console.log(`Fetched price for ${ticker}: $${stockPrice}`);
        const stockData = {
          stockTicker: ticker,
          stockPrice,
          stockName,
        };
        localStorage.setItem('lastStockSearch', JSON.stringify(stockData));
        navigate('/stockCharts', {
          state: stockData,
        });
      } else {
        console.error(`Failed to fetch price for ${ticker}`);
      }
    } catch (error) {
      console.error(`Error fetching price for ${ticker}:`, error);
    }
  };

  const handleBuyAmountChange = (ticker, value) => {
    setBuyAmounts({
      ...buyAmounts,
      [ticker]: value,
    });
  };

  const handleBuyStock = async (ticker) => {
    const amount = buyAmounts[ticker] || 0;
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const { stockPrice, stockName } = await fetchStockPrice(ticker, API_KEY);

      if (stockPrice === null) {
        alert('Could not retrieve stock price. Please try again.');
        return;
      }

      const stockData = {
        symbol: ticker,
        stockName: stockName,
        stockPrice: stockPrice,
      };

      const response = await fetch('http://localhost:3000/user/buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          stockData: stockData,
          amount: amount,
        }),
      });

      const result = await response.json();
      console.log('Stock bought:', result);

      if (response.ok) {
        alert('Stock bought successfully!');
      } else {
        throw new Error('Failed to buy stock');
      }
    } catch (error) {
      alert('Error buying stock. Please try again.');
      console.error('Error buying stock:', error);
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
                <div>
                  <input
                    type="number"
                    value={buyAmounts[stock.ticker] || ''}
                    onChange={(e) =>
                      handleBuyAmountChange(stock.ticker, e.target.value)
                    }
                    placeholder="Enter amount to buy"
                  />
                  <button onClick={() => handleBuyStock(stock.ticker)}>
                    Buy Stock
                  </button>
                </div>
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
