import { api } from '../api/api';

const usersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    postUser: builder.mutation({
      query: (newUser) => ({
        url: '/register',
        method: 'POST',
        body: newUser,
      }),
      providesTags: [{ type: 'User' }],
    }),
    getUserWatchlist: builder.query({
      query: () => ({
        url: '/user/watchlist',
        method: 'GET',
      }),
      providesTags: [{ type: 'User' }],
      transformResponse: (response) => ({
        ...response,
        wallet: response.wallet,
        ownedStocks: response.ownedStocks, // Include owned stocks in the response
      }),
    }),
  }),
});

export default usersApi;

export const { usePostUserMutation, useGetUserWatchlistQuery } = usersApi;
