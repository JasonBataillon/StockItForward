//Note: A lot of this is subject to change in the future.
//Such as, we may decide to make the call from our own
//database that has the stored data instead.
//If we keep this method of doing this, we may want to
//allow more options for the user to select to view data.

// export default StockCharts;
import { useEffect, useState } from "react";
import { useAddStockToWatchlistMutation } from "./stockChartSlice";
import { useLocation, useNavigate } from "react-router-dom";
//https://recharts.org/en-US/
//See guide there
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
  const stockTicker = location.state?.stockTicker; // Get stock ticker from location state or default to "AAPL"

  useEffect(() => {
    if (!stockTicker) {
      navigate("/stockSearch");
    }
  }, [stockTicker, navigate]);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stockPrice, setStockPrice] = useState(null);
  const [marketCap, setMarketCap] = useState(null);
  const [stockName, setStockName] = useState(null);
  // const [stockTicker, setStockTicker] = useState(null);
  const API_KEY = import.meta.env.VITE_POLYGON_API_KEY;

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const multiplier = 1; // Change this to get different time scale
        const timespan = "day"; // day, week, month, quarter, year
        const from = "2023-01-01"; // starting YEAR-MO-DA
        const to = "2023-12-31"; // ending YEAR-MO-DA
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
            date: new Date(item.t).toLocaleDateString(), // Convert timestamp to date string
            close: item.c, // Closing price
          }));

          setData(formattedData);
          setStockPrice(json.results[0].c);
          setMarketCap(json.results[0].marketCap || 0);
          setStockName(json.ticker);

          if (onStockPriceChange) {
            onStockPriceChange(json.results[0].c);
          }
        }
      } catch (error) {
        console.error("Error fetching stock data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (stockTicker) {
      fetchStockData();
    }
  }, [stockTicker, onStockPriceChange, API_KEY]);

  const saveStockToWatchlist = async () => {
    try {
      const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage
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

      if (!response.ok) {
        throw new Error("Failed to save stock to watchlist");
      }
    } catch (error) {
      alert("This stock is already in your watchlist!");
      console.error("Error saving stock to watchlist:", error);
    }
  };

  //Does the loading message thing while fetching
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <h2>Stock Chart for {stockTicker}</h2>
      <p>
        Current Price:{" "}
        {stockPrice !== null ? `$${stockPrice.toFixed(2)}` : "Loading..."}
      </p>
      {/* <p>
        Market Cap:{" "}
        {marketCap !== null ? `$${marketCap.toFixed(2)}` : "Loading..."}
      </p> */}
      {/* Render your chart here using the data */}
      <LineChart width={600} height={300} data={data}>
        <Line type="monotone" dataKey="close" stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
      </LineChart>
      <button onClick={saveStockToWatchlist}>Save to Watchlist</button>
    </div>
  );
};

export default StockChart;
