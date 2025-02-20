import React, { useState, useEffect } from 'react';
import { fetchStockPrice } from '../api/stockUtils';

const StockAlert = () => {
  const [price, setPrice] = useState(null);
  const [initialPrice, setInitialPrice] = useState(null);
  const [alert, setAlert] = useState(false);
  const [stockTicker, setStockTicker] = useState('AAPL');

  const handlePriceChange = (price) => {
    setPrice(price);
    if (initialPrice === null) {
      setInitialPrice(price);
    } else {
      const priceChange = ((price - initialPrice) / initialPrice) * 100;
      if (Math.abs(priceChange) >= 5) {
        setAlert(true);
      }
    }
  };

  const API_KEY = import.meta.env.VITE_POLYGON_API_KEY;
  const query = 'AAPL';

  useEffect(() => {
    const checkPriceChange = async () => {
      const currentPrice = await fetchStockPrice(query, API_KEY);
      if (currentPrice !== null) {
        handlePriceChange(currentPrice);
      }
    };

    const intervalId = setInterval(checkPriceChange, 300000); // Check every 5 minutes

    // Initial check
    checkPriceChange();
    const intervalId = setInterval(checkPriceChange, 300000); // Check every 5 minutes

    // Initial check
    checkPriceChange();

    return () => clearInterval(intervalId);
  }, [initialPrice, stockTicker]);

  return (
    <div>
      <h1>Stock Price Alerts</h1>
      <p>Stock: {stockTicker}</p>
      <p>
        Current Price:{' '}
        {price !== null && !isNaN(price)
          ? `$${price.toFixed(2)}`
          : 'Loading...'}
      </p>
      {alert && (
        <p style={{ color: 'red' }}>
          Alert: Stock price changed by 5% or more!
        </p>
      )}
      {/* <StockCharts onStockPriceChange={handlePriceChange} /> */}
      {/* <StockCharts onStockPriceChange={handlePriceChange} /> */}
    </div>
  );
};

export default StockAlert;
