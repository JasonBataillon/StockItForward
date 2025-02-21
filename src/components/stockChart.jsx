import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

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
      console.error("No stockTicker found in location state");
      navigate("/stockSearch"); // Redirect to stock search if no stockTicker is found
    }
  }, [stockTicker, navigate]);

  const [data, setData] = useState([]); //declaring hook for data storage
  const [loading, setLoading] = useState(true); //declaring hook to indicate whether app is working instead of blank screening
  const [stockPrice, setStockPrice] = useState(initialStockPrice);
  const [marketCap, setMarketCap] = useState(null);
  const [stockName] = useState(initialStockName); //at no point is setStockName used. I dont know why this is the case.

  const [watchlistMessage, setWatchlistMessage] = useState(null);
  const [queryTimespan, setQueryTimespan] = useState("day");
  const [queryFromDate, setQueryFromDate] = useState("2023-01-01");
  const [queryToDate, setQueryToDate] = useState("2023-12-31");
  const [queryAdjusted, setQueryAdjusted] = useState(true);
  const [queryTrigger, setQueryTrigger] = useState(0);

  const API_KEY = import.meta.env.VITE_POLYGON_API_KEY;

  const fetchStockData = async () => {
    try {
      const multiplier = 1; // Change this to get different time scale
      const timespan = queryTimespan; // day, week, month, quarter, year
      const from = queryFromDate; // starting YEAR-MO-DA
      const to = queryToDate; // ending YEAR-MO-DA
      const response = await fetch(
        `https://api.polygon.io/v2/aggs/ticker/${stockTicker}/range/${multiplier}/${timespan}/${from}/${to}?adjusted=true&sort=asc&limit=30&apiKey=${API_KEY}`
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized: Check your API key");
        } else {
          throw new Error("Network response was not ok");
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
      console.error("Error fetching stock data:", error);
    } finally {
      setLoading(false);
      console.log("Final data state:", data);
    }

    if (stockTicker) {
      fetchStockData();
    }
  };

  const saveStockToWatchlist = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await fetch("http://localhost:3000/watchlist/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
      console.log("Stock saved to watchlist:", result);

      if (response.ok) {
        setWatchlistMessage(
          "This stock has been added into your watchlist!",
          result
        );
      } else {
        throw new Error("Failed to save stock to watchlist");
      }
    } catch (error) {
      setWatchlistMessage(error, "Could it already be in your watchlist?");
      console.error("Error saving stock to watchlist:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setQueryTrigger((prev) => prev + 1);
  };

  return (
    <div>
      <h1>Stock Charts</h1>
      <div>{stockTicker}</div>
      <div>{stockName}</div>
      <p>
        Current Price:{" "}
        {stockPrice !== null ? `$${stockPrice.toFixed(2)}` : "Loading..."}
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
        <YAxis domain={["auto", "dataMax + 5"]} />
        <Tooltip />
      </LineChart>
      <button onClick={saveStockToWatchlist}>Save to Watchlist</button>
      <div>{watchlistMessage}</div>
      <form onSubmit={handleFormSubmit}>
        <label>Timespan:</label>
        <select
          id="timespan"
          name="timespan"
          onChange={(e) => setQueryTimespan(e.target.value)}
        >
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="quarter">Quarter</option>
          <option value="year">Year</option>
        </select>
        <br />
        <label htmlFor="date">From:</label>{" "}
        <input
          type="date"
          id="fromDate"
          name="date"
          onChange={(e) => setQueryFromDate(e.target.value)}
        />
        <br />
        <label htmlFor="date">To:</label>
        <input
          type="date"
          id="toDate"
          name="date"
          onChange={(e) => setQueryToDate(e.target.value)}
        />
        <br />
        <label>Adjusted True:</label>
        <input
          type="checkbox"
          id="boolAdjusted"
          name="boolAdjusted"
          onChange={(e) => setQueryAdjusted(e.target.checked)}
        />
        <br />
      </form>
    </div>
  );
};

export default StockChart;
