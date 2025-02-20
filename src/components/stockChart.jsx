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
    stockTicker,
    stockPrice: initialStockPrice,
    stockName: initialStockName,
  } = location.state || {};

  useEffect(() => {
    if (!stockTicker) {
      console.error('No stockTicker found in location state');
      navigate('/stockSearch'); // Redirect to stock search if no stockTicker is found
    }
  }, [stockTicker, navigate]);

  const [data, setData] = useState([]); //declaring hook for data storage
  const [loading, setLoading] = useState(true); //declaring hook to indicate whether app is working instead of blank screening
  const [stockPrice, setStockPrice] = useState(initialStockPrice);
  const [marketCap, setMarketCap] = useState(null);
  const [stockName, setStockName] = useState(initialStockName);
  const API_KEY = import.meta.env.VITE_POLYGON_API_KEY;

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const multiplier = 1; // Change this to get different time scale
        const timespan = 'day'; // day, week, month, quarter, year
        const from = '2023-01-01'; // starting YEAR-MO-DA
        const to = '2023-12-31'; // ending YEAR-MO-DA
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

          if (onStockPriceChange) {
            onStockPriceChange(json.results[0].c);
          }
        }
      } catch (error) {
        console.error('Error fetching stock data:', error);
      } finally {
        setLoading(false);
        setLoading(false);
      }
    };

    if (stockTicker) {
      fetchStockData();
    }
  }, [API_KEY, stockTicker, onStockPriceChange]);

  const saveStockToWatchlist = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch('http://localhost:3000/watchlist/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          stockTicker,
          stockName,
          stockPrice,
          marketCap,
        }),
      });

      const result = await response.json();
      console.log('Stock saved to watchlist:', result);

      if (response.ok) {
        alert('This stock has been added into your watchlist!', result);
      } else {
        throw new Error('Failed to save stock to watchlist');
      }
    } catch (error) {
      alert('This stock is already in your watchlist!');
      console.error('Error saving stock to watchlist:', error);
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
    </div>
  );
};

export default StockChart;
