import { configureStore } from '@reduxjs/toolkit';
import { api } from './api';

// Configure the Redux store
export const store = configureStore({
  // Add the API reducer to the store
  reducer: {
    [api.reducerPath]: api.reducer,
  },
  // Add the API middleware to the store
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export default store;
