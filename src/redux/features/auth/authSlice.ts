 
// authSlice.ts
import { createSlice} from "@reduxjs/toolkit";

interface AuthState {
  user: { role: string } | null;
  accessToken: string | null;
}

const initialState: AuthState = {
  user: localStorage.getItem("role") ? { role: localStorage.getItem("role")! } : null,
  accessToken: localStorage.getItem("token") || null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload.accessToken;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      localStorage.clear();
    },
  },
});

export const { setAccessToken, logout } = authSlice.actions;
export default authSlice.reducer;








 






// // authSlice.ts
// import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

// interface AuthState {
//   accessToken: string | null;
// }

// const initialState: AuthState = {
//   accessToken: null,
// };

// // Thunk to load token from localStorage
// export const loadUserFromToken = createAsyncThunk(
//   "auth/loadUserFromToken",
//   async (_, { dispatch }) => {
//     const token = localStorage.getItem("accessToken");
//     if (token) {
//       dispatch(setAccessToken(token));
//     }
//   }
// );

// export const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     setAccessToken: (state, action: PayloadAction<string>) => {
//       state.accessToken = action.payload;
//     },
//     logout: (state) => {
//       state.accessToken = null;
//       localStorage.removeItem("accessToken");
//     },
//   },
// });

// export const { setAccessToken, logout } = authSlice.actions;
// export default authSlice.reducer;








 