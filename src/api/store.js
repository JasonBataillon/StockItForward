import { configureStore } from '@reduxjs/toolkit';
import { api } from './api';
// import homeReducer from "../components/";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    // home: homeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export default store;
