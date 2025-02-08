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
//Axios for API calls
import axios from "axios";

const StockCharts = ({ symbol }) => {
  const [data, setData] = useState([]); //declaring hook for data storage
  const [loading, setLoading] = useState(true); //declaring hook to indicate whether app is working instead of blank screening
  //   const API_KEY = import.process.env.REACT_APP_POLYGON_API_KEY; //Get the API key from environment variable
  const API_KEY = import.meta.env.VITE_POLYGON_API_KEY;
  //   console.log({ API_KEY }); // Just to verify it's working

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
        const response = await axios.get(
          `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/2023-01-01/2023-12-31`,
          {
            params: {},
            adjusted: true,
            sort: "asc",
            limit: 30,
            apiKey: API_KEY,
          }
        );
        const json = response.data; //Take the data from Axios into the json

        if (json.results) {
          //Format the data for chart to read
          const formattedData = json.results.map((item) => ({
            date: new Date(item.t).toLocaleDateString(), // Convert timestamp to date string
            close: item.c, // Closing price
          }));
          setData(formattedData); //Set the data to the formatted data}
        }
      } catch (error) {
        //Log Errors during fetching
        console.error("Error fetching stock data:", error);
      } finally {
        setLoading(false); //Set loading to false when done. This is neat/
      }
    };
    fetchStockData(); //run that useEffect function above
  }, [symbol, API_KEY]);

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
        width={400}
        height={400}
        data={data}
        margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
      >
        <Line type="monotone" dataKey="uv" stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" strokeWidth={1} />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
      </LineChart>
    </div>
  );
};

export default StockCharts;
