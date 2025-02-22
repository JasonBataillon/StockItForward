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
  console.log("StockChart component");
  const location = useLocation();
  const navigate = useNavigate();
  const {
    stockTicker,
    stockPrice: initialStockPrice,
    stockName,
  } = location.state || {};

  useEffect(() => {
    if (!stockTicker) {
      console.error("No stockTicker found in location state");
      navigate("/stockSearch");
    }
  }, [stockTicker, navigate]);

  const today = new Date().toISOString().split("T")[0];
  const lastMonth = new Date(today);
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  const formattedLastMonth = lastMonth.toISOString().split("T")[0];
  console.log("today", today);

  console.log("lastMonth", formattedLastMonth);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stockPrice, setStockPrice] = useState(initialStockPrice);
  const [marketCap, setMarketCap] = useState(null);
  const [watchlistMessage, setWatchlistMessage] = useState(null);
  const [queryTimespan, setQueryTimespan] = useState("day");
  const [queryFromDate, setQueryFromDate] = useState(formattedLastMonth);
  const [queryToDate, setQueryToDate] = useState(today);
  const [queryAdjusted, setQueryAdjusted] = useState(true);
  const [queryTrigger, setQueryTrigger] = useState(0);

  const API_KEY = import.meta.env.VITE_POLYGON_API_KEY;

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        console.log("useEffect fetchStockData");
        const multiplier = 1;
        const response = await fetch(
          `https://api.polygon.io/v2/aggs/ticker/${stockTicker}/range/${multiplier}/${queryTimespan}/${queryFromDate}/${queryToDate}?adjusted=${queryAdjusted}&sort=asc&limit=30&apiKey=${API_KEY}`
        );

        if (!response.ok) {
          throw new Error(
            response.status === 401
              ? "Unauthorized: Check your API key"
              : "Network response was not ok"
          );
        }

        const json = await response.json();

        if (json.results) {
          const formattedData = json.results.map((item) => ({
            date: new Date(item.t).toLocaleDateString(),
            close: item.c,
          }));

          setData(formattedData);
          setStockPrice(json.results[0]?.c || 0);
          setMarketCap(json.results[0]?.marketCap || 0);

          if (onStockPriceChange) {
            onStockPriceChange(json.results[0]?.c || 0);
          }
        }
      } catch (error) {
        console.error("Error fetching stock data:", error);
      } finally {
        setLoading(false);
        console.log("Final data state:", data);
      }
    };

    if (stockTicker) {
      console.log("stockTicker ok");
      fetchStockData();
    }
  }, [queryTrigger]);

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

      if (!response.ok) {
        throw new Error("Failed to save stock to watchlist");
      }

      const result = await response.json();
      console.log("Stock saved to watchlist:", result);
      setWatchlistMessage("This stock has been added into your watchlist!");
    } catch (error) {
      setWatchlistMessage("Could it already be in your watchlist?");
      console.error("Error saving stock to watchlist:", error);
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
      <form
        onSubmit={(e) => {
          console.log("Form submitted *button clicked*");
          e.preventDefault();
          setQueryTrigger((prev) => prev + 1);
        }}
      >
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
        <label htmlFor="fromDate">From:</label>
        <input
          type="date"
          id="fromDate"
          name="date"
          onChange={(e) => setQueryFromDate(e.target.value)}
        />
        <br />
        <label htmlFor="toDate">To:</label>
        <input
          type="date"
          id="toDate"
          name="date"
          onChange={(e) => {
            const formattedDate = new Date(e.target.value)
              .toISOString()
              .split("T")[0];
            setQueryToDate(formattedDate);
          }}
        />
        <br />
        <label>Adjusted:</label>
        <input
          type="checkbox"
          id="boolAdjusted"
          name="boolAdjusted"
          checked={queryAdjusted}
          onChange={(e) => {
            const formattedDate = new Date(e.target.value)
              .toISOString()
              .split("T")[0];
            setQueryToDate(formattedDate);
          }}
        />
        <br />
        <button type="submit">Update Chart</button>
      </form>
    </div>
  );
};

export default StockChart;
