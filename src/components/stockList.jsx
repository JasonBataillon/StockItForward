import React, { useEffect, useState } from "react";
import axios from "axios";

const StockList = ({ query }) => {
  console.log("StockList");
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStocks = async (query) => {
    setLoading(true); //just makes it display loading message while working
    try {
      //import APIKey from .env
      const API_KEY = import.meta.env.VITE_POLYGON_API_KEY;

      const response = await axios.get(
        "https://api.polygon.io/v3/reference/tickers",
        {
          params: {
            apiKey: API_KEY,
            market: "stocks", // stocks, crypto, forex
            active: true, //true for only the active stocks
            limit: 25, // How many stocks that will be got
            search: query,
          },
        }
      );
      console.log(response); //check what we set to stocks
      setStocks(response.data.results); //store this
    } catch (error) {
      console.error("Something went wrong, good luck figuring out what: ", {
        error,
      });
      setError("Failed to load stocks");
    } finally {
      setLoading(false); //clears loading when error or success
    }
  };
  //https://polygon.io/docs/stocks/get_v3_reference_tickers
  useEffect(() => {
    fetchStocks();
  }, [query]);
  //standard loading and error indicators
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  //   //need to work out getting the function call happen only when search button is pressed instead of onChange of input
  //   const handleSearch = () => {
  //     fetchStocks(searchTerm);
  //   };

  return (
    <div>
      <h1>Stocks</h1>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}.</p>}
      <ul>
        {stocks.map((stock) => (
          <li key={stock.ticker}>
            {stock.ticker} - {stock.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StockList;
