import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { fetchStockPrice } from '../api/stockUtils';

Modal.setAppElement('#root'); // Set the root element for accessibility

const StockAlert = () => {
  const [price, setPrice] = useState(null);
  const [initialPrice, setInitialPrice] = useState(null);
  const [alert, setAlert] = useState(false);
  const [stockTicker, setStockTicker] = useState('AAPL'); // Set a default stock ticker

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

  useEffect(() => {
    const checkPriceChange = async () => {
      const cachedData = localStorage.getItem(`stockData_${stockTicker}`);
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        handlePriceChange(parsedData.stockPrice);
        return;
      }

      const { stockPrice } = await fetchStockPrice(stockTicker, API_KEY);
      if (stockPrice !== null) {
        handlePriceChange(stockPrice);
        localStorage.setItem(
          `stockData_${stockTicker}`,
          JSON.stringify({ stockPrice })
        );
      }
    };

    // Initial check
    checkPriceChange();
    const intervalId = setInterval(checkPriceChange, 600000); // Check every 10 minutes

    return () => clearInterval(intervalId);
  }, [initialPrice, stockTicker, API_KEY]);

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
      <Modal
        isOpen={alert}
        onRequestClose={() => setAlert(false)}
        contentLabel="Stock Price Alert"
      >
        <h2>Stock Price Alert</h2>
        <p>Stock: {stockTicker}</p>
        <p>
          Current Price:{' '}
          {price !== null && !isNaN(price)
            ? `$${price.toFixed(2)}`
            : 'Loading...'}
        </p>
        <p style={{ color: 'red' }}>
          Alert: Stock price changed by 5% or more!
        </p>
        <button onClick={() => setAlert(false)}>Close</button>
      </Modal>
    </div>
  );
};

export default StockAlert;
