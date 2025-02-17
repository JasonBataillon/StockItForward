//Functionality: Search stocks on Polygon.io by search API call

import { useState } from "react";

const StockSearch = () => {
  const API_KEY = import.meta.env.VITE_POLYGON_API_KEY; //Get API key from /.env

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false); //boilerplate loading state
  const [error, setError] = useState(null); //boilerplate error handling
  const [ranOnce, setRanOnce] = useState(false); //Brute force check

  const fetchStockData = async (e) => {
    e.preventDefault();
    setError(null);
    setResults([]);
    setLoading(true); //Will just inform program is processing
    setTimeout(), 3000; //force delay of 3 seconds
    setRanOnce(true);

    try {
      const response = await fetch(
        `https://api.polygon.io/v3/reference/tickers?search=${query}&apiKey=${API_KEY}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const result = await response.json();
      setResults(result.results || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Stock Search</h2>
      <form onSubmit={fetchStockData}>
        <input
          type="text"
          placeholder="Enter stock query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {results.length > 0 && (
        <div>
          <h3>Results:</h3>
          <ul>
            {results.map((stock) => (
              <li key={stock.ticker}>
                <strong>
                  {stock.name} <button>{stock.ticker}</button>
                </strong>
              </li>
            ))}
          </ul>
        </div>
      )}
      {results.length === 0 && ranOnce && !loading && <p>No results found</p>}
    </div>
  );
};

export default StockSearch;

//ignore below
//archaic code i dont want to toss yet.
//       const response = await axios.get(
//         "https://api.polygon.io/v3/reference/tickers",
//         {
//           params: {
//             apiKey: API_KEY,
//             market: "stocks", // stocks, crypto, forex
//             active: true, //true for only the active stocks
//             limit: 25, // How many stocks that will be got
//             search: query,
//           },
//         }
//       );
