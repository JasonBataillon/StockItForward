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
import StockAlert from "./Untitled-1";
import fetch from "node-fetch";

const StockAlert = ({ stockSymbol }) => {
  const [price, setPrice] = useState(null);
  const [initialPrice, setInitialPrice] = useState(null);
  const [alert, setAlert] = useState(false);

  useEffect(() => {
    const fetchStockPrice = async () => {
      // Replace with actual API call to fetch stock price
      const response = await fetch(
        `https://api.example.com/stocks/${stockSymbol}`
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
    };

    const intervalId = setInterval(checkPriceChange, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, [initialPrice, stockSymbol]);

  return (
    <div>
      <h1>Stock Price Alert</h1>
      <p>Stock: {stockSymbol}</p>
      <p>Current Price: {price}</p>
      {alert && (
        <p style={{ color: "red" }}>
          Alert: Stock price changed by 5% or more!
        </p>
      )}
    </div>
  );
};

export default StockAlert;
