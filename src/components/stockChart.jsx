//Note: A lot of this is subject to change in the future.
//Such as, we may decide to make the call from our own
//database that has the stored data instead.
//If we keep this method of doing this, we may want to
//allow more options for the user to select to view data.

import React, { useEffect, useState } from "react";
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
import { useAddStockToWatchlistMutation } from "./stockChartSlice";

const StockCharts = () => {
  const [data, setData] = useState([]); //declaring hook for data storage
  const [loading, setLoading] = useState(true); //declaring hook to indicate whether app is working instead of blank screening
  //   const API_KEY = import.process.env.REACT_APP_POLYGON_API_KEY; //Get the API key from environment variable
  const API_KEY = import.meta.env.VITE_POLYGON_API_KEY;
  const [addStockToWatchlist] = useAddStockToWatchlistMutation();

  //Dummy data
  //Needs data in order to function, we will aim to collect this
  //with a function with the API call.
  //Comment it out and add legitimate functionality
  //   const data = [
  //     { name: "Page A", uv: 400, pv: 2400, amt: 2400 },
  //     { name: "Page B", uv: 300, pv: 1398, amt: 2210 },
  //     { name: "Page C", uv: 200, pv: 9800, amt: 2290 },
  //     { name: "Page D", uv: 278, pv: 3908, amt: 2000 },
  //     { name: "Page E", uv: 189, pv: 4800, amt: 2181 },
  //     { name: "Page F", uv: 239, pv: 3800, amt: 2500 },
  //     { name: "Page G", uv: 349, pv: 4300, amt: 2100 },
  //   ];

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        //When moving to allow user to control these, we may need to have these values passed as props
        const stocksTicker = "AAPL"; // Change this to get different stock
        const multiplier = 1; // Change this to get different time scale
        const timespan = "day"; // day, week, month, quarter, year
        const from = "2023-01-01"; // starting YEAR-MO-DA
        const to = "2023-12-31"; // ending YEAR-MO-DA
        const response = await fetch(
          //url can be controlled by what stock by the content between

          `https://api.polygon.io/v2/aggs/ticker/${stocksTicker}/range/${multiplier}/${timespan}/${from}/${to}?adjusted=true&sort=asc&limit=30&apiKey=${API_KEY}`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const json = await response.json(); //Take the data from Axios into the json

        if (json.results) {
          //Format the data for chart to read
          const formattedData = json.results.map((item) => ({
            date: new Date(item.t).toLocaleDateString(), // Convert timestamp to date string
            close: item.c, // Closing price
          }));

          setData(formattedData); //Set the data to the formatted data}

          await saveStockToWatchlist(stocksTicker, "Apple Inc."); //Save the stock to the watchlist
        }
      } catch (error) {
        //Log Errors during fetching
        console.error("Error fetching stock data:", error);
      } finally {
        setLoading(false); //Set loading to false when done. This is neat/
      }
    };

    const saveStockToWatchlist = async (stockTicker, stockName) => {
      try {
        const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage
        // const response = await fetch('/watchlist/add', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //     Authorization: `Bearer ${token}`,
        //   },
        //   body: JSON.stringify({ stockTicker, stockName }),
        // });

        // if (!response.ok) {
        //   throw new Error('Failed to save stock to watchlist');
        // }

        // const result = await response.json();
        await addStockToWatchlist({ stockTicker, stockName, token }).unwrap();
        console.log("Stock saved to watchlist:");
      } catch (error) {
        console.error("Error saving stock to watchlist:", error);
      }
    };

    fetchStockData(); //run that useEffect function above
  }, [API_KEY]);

  //Does the loading message thing while fetching
  if (loading) {
    return <div>Loading...</div>;
  }

  //CartesianGrid - background lines to help measure
  //Line, yes, that will be the line in the graphic
  //Xaxis dataKey="name" - displays the name of the X-related data point given in the data value

  //Tooltip - hovering displays the specific data point. Useful!

  return (
    <div>
      <h1>Stock Charts</h1>
      <LineChart
        width={800}
        height={800}
        data={data}
        margin={{ top: 20, right: 20, bottom: 5, left: 0 }}
      >
        <Line type="monotone" dataKey="close" stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" strokeWidth={1} />
        <XAxis dataKey="date" />
        <YAxis domain={["auto", "dataMax + 5", "dataMin - 5"]} />{" "}
        {/* Adds space to top of graph*/}
        <Tooltip />
      </LineChart>
    </div>
  );
};

export default StockCharts;
