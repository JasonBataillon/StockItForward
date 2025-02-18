// import React, { useEffect, useState } from 'react';

// const Alert = ({ stock }) => {
//     const [alert, setAlert] = useState('');

//     useEffect(() => {
//         const checkStockChange = () => {
//             const change = ((stock.currentPrice - stock.previousPrice) / stock.previousPrice) * 100;
//             if (change > 5) {
//                 setAlert(`Alert: ${stock.name} has increased by more than 5%!`);
//             } else if (change < -5) {
//                 setAlert(`Alert: ${stock.name} has decreased by more than 5%!`);
//             } else {
//                 setAlert('');
//             }
//         };

//         checkStockChange();
//     }, [stock]);

//     return (
//         <div>
//             {alert && <div className="alert">{alert}</div>}
//         </div>
//     );
// };
import React, { useState, useEffect } from "react";
import StockCharts from "./stockChart";

const StockAlert = () => {
  const [price, setPrice] = useState(null);
  const [initialPrice, setInitialPrice] = useState(null);
  const [alert, setAlert] = useState(false);
  const [stockTicker, setStockTicker] = useState("AAPL");

  // console.log(price);
  // console.log(initialPrice);
  console.log(alert);
  console.log(stockTicker);

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
  // const stocksTicker = location.state?.stockTicker || "AAPL";
  const API_KEY = import.meta.env.VITE_POLYGON_API_KEY;
  const query = "AAPL";
  useEffect(() => {
    const fetchStockPrice = async () => {
      // Replace with actual API call to fetch stock price
      const response = await fetch(
        `https://api.polygon.io/v3/reference/tickers?search=${query}&apiKey=${API_KEY}`
      );
      const data = await response.json();
      return data.price;
    };

    const checkPriceChange = async () => {
      const currentPrice = await fetchStockPrice();
      if (initialPrice === null) {
        setInitialPrice(currentPrice);
      } else {
        const priceChange =
          ((currentPrice - initialPrice) / initialPrice) * 100;
        if (Math.abs(priceChange) >= 5) {
          setAlert(true);
        }
      }
      setPrice(currentPrice);
      console.log(price);
    };

    const intervalId = setInterval(checkPriceChange, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, [initialPrice, stockTicker]);

  return (
    <div>
      <h1>Stock Price Alerts</h1>
      <p>Stock: {stockTicker}</p>
      <p>Current Price: {price}</p>
      {alert && (
        <p style={{ color: "red" }}>
          Alert: Stock price changed by 5% or more!
        </p>
      )}
      <StockCharts onStockPriceChange={handlePriceChange} />
    </div>
  );
};

export default StockAlert;
