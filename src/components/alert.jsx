import React, { useState, useEffect } from "react";

const StockAlert = () => {
  const [price, setPrice] = useState(null);
  const [initialPrice, setInitialPrice] = useState(null);
  const [alert, setAlert] = useState(false);
  const [stockTicker, setStockTicker] = useState("AAPL");

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
  const query = "AAPL";

  useEffect(() => {
    const fetchStockPrice = async () => {
      try {
        const response = await fetch(
          `https://api.polygon.io/v2/aggs/ticker/${query}/prev?adjusted=true&apiKey=${API_KEY}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          return data.results[0].c; // 'c' is the close price
        } else {
          console.error("No results found in API response");
          return null;
        }
      } catch (error) {
        console.error("Error fetching stock price:", error);
        return null;
      }
    };

    const checkPriceChange = async () => {
      const currentPrice = await fetchStockPrice();
      if (currentPrice !== null) {
        handlePriceChange(currentPrice);
      }
    };

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
        Current Price:{" "}
        {price !== null && !isNaN(price)
          ? `$${price.toFixed(2)}`
          : "Loading..."}
      </p>
      {alert && (
        <p style={{ color: "red" }}>
          Alert: Stock price changed by 5% or more!
        </p>
      )}
      {/* <StockCharts onStockPriceChange={handlePriceChange} /> */}
    </div>
  );
};

export default StockAlert;
