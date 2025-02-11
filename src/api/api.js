import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// const API_URL = `https://stockitback.onrender.com`;
const API_URL = `https://stockitback.onrender.com`;

const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User'],
  endpoints: () => ({}),
});
export default api;
