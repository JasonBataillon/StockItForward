import { api } from '../api/api';

const watchlistApi = api.injectEndpoints({
  endpoints: (builder) => ({
    addStockToWatchlist: builder.mutation({
      query: (watchlist) => ({
        url: '/watchlist/add',
        method: 'POST',
        body: watchlist,
      }),
      providesTags: [{ type: 'User' }],
    }),
  }),
});

export const { useAddStockToWatchlistMutation } = watchlistApi;
export default watchlistApi;
