import React, { useEffect, useState } from "react";

const Home = () => {
  const [marketStatus, setMarketStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_KEY = import.meta.env.VITE_POLYGON_API_KEY;
  const CACHE_KEY = "marketStatus";
  const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds

  useEffect(() => {
    const fetchMarketStatus = async () => {
      try {
        const response = await fetch(
          `https://api.polygon.io/v1/marketstatus/now?apiKey=${API_KEY}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        const timestamp = new Date().getTime();
        localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp }));
        setMarketStatus(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      const now = new Date().getTime();
      if (now - timestamp < CACHE_DURATION) {
        setMarketStatus(data);
        setLoading(false);
        return;
      }
    }

    fetchMarketStatus();
  }, [API_KEY]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Market Status</h1>
      {marketStatus && (
        <div>
          <div>Market: {marketStatus.market}</div>
          <div>Server Time: {marketStatus.serverTime}</div>
          <div>After Hours: {marketStatus.afterHours ? "Yes" : "No"}</div>
          <div>Early Hours: {marketStatus.earlyHours ? "Yes" : "No"}</div>
          <h2>Currencies</h2>
          <div>Crypto: {marketStatus.currencies.crypto}</div>
          <div>Forex: {marketStatus.currencies.fx}</div>
          <h2>Exchanges</h2>
          <div>Nasdaq: {marketStatus.exchanges.nasdaq}</div>
          <div>NYSE: {marketStatus.exchanges.nyse}</div>
          <div>OTC: {marketStatus.exchanges.otc}</div>
          <h2>Indices Groups</h2>
          <div>CCCY: {marketStatus.indicesGroups.cccy}</div>
          <div>CGI: {marketStatus.indicesGroups.cgi}</div>
          <div>Dow Jones: {marketStatus.indicesGroups.dow_jones}</div>
          <div>FTSE Russell: {marketStatus.indicesGroups.ftse_russell}</div>
          <div>MSCI: {marketStatus.indicesGroups.msci}</div>
          <div>Morningstar: {marketStatus.indicesGroups.mstar}</div>
          <div>Morningstar Customer: {marketStatus.indicesGroups.mstarc}</div>
          <div>Nasdaq: {marketStatus.indicesGroups.nasdaq}</div>
          <div>S&P: {marketStatus.indicesGroups.s_and_p}</div>
          <div>
            Societe Generale: {marketStatus.indicesGroups.societe_generale}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
