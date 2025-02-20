export const fetchStockPrice = async (query, API_KEY) => {
  try {
    const response = await fetch(
      `https://api.polygon.io/v2/aggs/ticker/${query}/prev?adjusted=true&apiKey=${API_KEY}`
    );
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log('API response:', data); // Log the entire response

    if (!data.results || data.results.length === 0) {
      throw new Error('No results found in API response');
    }

    const stockPrice = data.results[0].c; // 'c' is the close price
    console.log('Stock price:', stockPrice);

    // Fetch stock name
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
