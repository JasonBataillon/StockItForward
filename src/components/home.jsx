import React, { useEffect, useState } from 'react';

const Home = () => {
  const [marketStatus, setMarketStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_KEY = import.meta.env.VITE_POLYGON_API_KEY;
  const CACHE_KEY = 'marketStatus';
  const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds

  useEffect(() => {
    const fetchMarketStatus = async () => {
      try {
        const response = await fetch(
          `https://api.polygon.io/v1/marketstatus/now?apiKey=${API_KEY}`
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
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
          <p>Market: {marketStatus.market}</p>
          <p>Server Time: {marketStatus.serverTime}</p>
          <p>After Hours: {marketStatus.afterHours ? 'Yes' : 'No'}</p>
          <p>Early Hours: {marketStatus.earlyHours ? 'Yes' : 'No'}</p>
          <h2>Currencies</h2>
          <p>Crypto: {marketStatus.currencies.crypto}</p>
          <p>Forex: {marketStatus.currencies.fx}</p>
          <h2>Exchanges</h2>
          <p>Nasdaq: {marketStatus.exchanges.nasdaq}</p>
          <p>NYSE: {marketStatus.exchanges.nyse}</p>
          <p>OTC: {marketStatus.exchanges.otc}</p>
          <h2>Indices Groups</h2>
          <p>CCCY: {marketStatus.indicesGroups.cccy}</p>
          <p>CGI: {marketStatus.indicesGroups.cgi}</p>
          <p>Dow Jones: {marketStatus.indicesGroups.dow_jones}</p>
          <p>FTSE Russell: {marketStatus.indicesGroups.ftse_russell}</p>
          <p>MSCI: {marketStatus.indicesGroups.msci}</p>
          <p>Morningstar: {marketStatus.indicesGroups.mstar}</p>
          <p>Morningstar Customer: {marketStatus.indicesGroups.mstarc}</p>
          <p>Nasdaq: {marketStatus.indicesGroups.nasdaq}</p>
          <p>S&P: {marketStatus.indicesGroups.s_and_p}</p>
          <p>Societe Generale: {marketStatus.indicesGroups.societe_generale}</p>
        </div>
      )}
    </div>
  );
};

export default Home;
