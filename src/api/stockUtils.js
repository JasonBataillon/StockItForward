export const fetchStockPrice = async (query, API_KEY) => {
  try {
    // Fetch the previous day's stock price
    const response = await fetch(
      `https://api.polygon.io/v2/aggs/ticker/${query}/prev?adjusted=true&apiKey=${API_KEY}`
    );
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();

    // Check if the response contains results
    if (!data.results || data.results.length === 0) {
      throw new Error('No results found in API response');
    }

    // Extract the closing price from the results
    const stockPrice = data.results[0].c;

    // Fetch the stock name
    const nameResponse = await fetch(
      `https://api.polygon.io/v3/reference/tickers/${query}?apiKey=${API_KEY}`
    );
    if (!nameResponse.ok) {
      throw new Error('Network response was not ok');
    }
    const nameData = await nameResponse.json();
    const stockName = nameData.results.name;

    return { stockPrice, stockName };
  } catch (error) {
    console.error('Error fetching stock price for query:', query, error);
    return null;
  }
};
