import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

const StockChart = ({ onStockPriceChange }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    stockTicker: initialStockTicker,
    stockPrice: initialStockPrice,
    stockName: initialStockName,
  } = location.state || {};

  const [stockTicker, setStockTicker] = useState(initialStockTicker);
  const [stockPrice, setStockPrice] = useState(initialStockPrice);
  const [stockName, setStockName] = useState(initialStockName);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marketCap, setMarketCap] = useState(null);
  const [watchlistMessage, setWatchlistMessage] = useState(null);
  const [buyAmount, setBuyAmount] = useState(0);

  const API_KEY = import.meta.env.VITE_POLYGON_API_KEY;
  const today = new Date().toISOString().split('T')[0];
  const lastMonth = new Date(today);
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  const formattedLastMonth = lastMonth.toISOString().split('T')[0];

  const STOCK_DATA_KEY = `stockData_${stockTicker}`; // Define the key

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const multiplier = 1;
        const timespan = 'day';
        const from = formattedLastMonth;
        const to = today;

        const cachedData = localStorage.getItem(STOCK_DATA_KEY);
        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          setData(parsedData.data);
          setStockPrice(parsedData.stockPrice);
          setMarketCap(parsedData.marketCap);
          setStockName(parsedData.stockName);
          setLoading(false);
          return;
        }

        const response = await fetch(
          `https://api.polygon.io/v2/aggs/ticker/${stockTicker}/range/${multiplier}/${timespan}/${from}/${to}?adjusted=true&sort=asc&limit=30&apiKey=${API_KEY}`
        );

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Unauthorized: Check your API key');
          } else {
            throw new Error('Network response was not ok');
          }
        }

        const json = await response.json();

        if (json.results) {
          const formattedData = json.results.map((item) => ({
            date: new Date(item.t).toLocaleDateString(),
            close: item.c,
          }));

          setData(formattedData);
          setStockPrice(json.results[0].c);
          setMarketCap(json.results[0].marketCap || 0);

          localStorage.setItem(
            STOCK_DATA_KEY,
            JSON.stringify({
              data: formattedData,
              stockPrice: json.results[0].c,
              marketCap: json.results[0].marketCap || 0,
              stockName: initialStockName,
            })
          );

          if (onStockPriceChange) {
            onStockPriceChange(json.results[0].c);
          }
        }
      } catch (error) {
        console.error('Error fetching stock data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (stockTicker) {
      fetchStockData();
    } else {
      const cachedData = localStorage.getItem('lastStockSearch');
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        setStockTicker(parsedData.stockTicker);
        setStockPrice(parsedData.stockPrice);
        setStockName(parsedData.stockName);
        setData(parsedData.data);
        setMarketCap(parsedData.marketCap);
        setLoading(false);
      } else {
        navigate('/stockSearch');
      }
    }
  }, [
    API_KEY,
    stockTicker,
    onStockPriceChange,
    initialStockName,
    navigate,
    STOCK_DATA_KEY,
  ]); // added STOCK_DATA_KEY to dependency array

  const saveStockToWatchlist = async () => {
    // ... (watchlist code remains the same)
  };

  const handleBuyStock = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const stockData = JSON.parse(localStorage.getItem(STOCK_DATA_KEY));
      if (!stockData) {
        throw new Error('No stock data found in local storage');
      }

      const amount = buyAmount;

      const response = await fetch('http://localhost:3000/user/buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          stockData: { ...stockData, symbol: stockTicker }, // Send the entire stockData object
          amount: amount,
        }),
      });

      const result = await response.json();
      console.log('Stock bought:', result);

      if (response.ok) {
        setWatchlistMessage('Stock bought successfully!');
      } else {
        throw new Error('Failed to buy stock');
      }
    } catch (error) {
      setWatchlistMessage('You have insufficient funds!');
      console.error('Error buying stock:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Stock Charts</h1>
      <div>{stockTicker}</div>
      <div>{stockName}</div>
      <p>
        Current Price:{' '}
        {stockPrice !== null ? `$${stockPrice.toFixed(2)}` : 'Loading...'}
      </p>
      <LineChart
        width={800}
        height={800}
        data={data}
        margin={{ top: 20, right: 20, bottom: 5, left: 0 }}
      >
        <Line type="monotone" dataKey="close" stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="date" />
        <YAxis domain={['auto', 'dataMax + 5']} />
        <Tooltip />
      </LineChart>
      <button onClick={saveStockToWatchlist}>Save to Watchlist</button>
      <div>{watchlistMessage}</div>
      <div>
        <input
          type="number"
          value={buyAmount}
          onChange={(e) => setBuyAmount(e.target.value)}
          placeholder="Enter amount to buy"
        />
        <button onClick={handleBuyStock}>Buy Stock</button>
      </div>
    </div>
  );
};

export default StockChart;
