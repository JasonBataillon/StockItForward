import api from "../api/api.js";

const usersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    postUser: builder.mutation({
      query: (newUser) => ({
        url: "/register",
        method: "POST",
        body: newUser,
      }),
      providesTags: [{ type: "User" }],
    }),
  }),
});

export default usersApi;

export const { usePostUserMutation } = usersApi;
