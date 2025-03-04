import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_URL = `http://localhost:3000/`;
// const API_URL = `https://stockitforward.herokuapp.com/`;

// Create an API service using Redux Toolkit Query
export const api = createApi({
  // Unique key to identify the API reducer in the store
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers) => {
      // Add authorization header if token is available
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  // Define tag types for cache invalidation
  tagTypes: ['User'],
  // Define API endpoints (empty for now)
  endpoints: () => ({}),
});
