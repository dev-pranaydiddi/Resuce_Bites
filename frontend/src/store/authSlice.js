import { createSlice } from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";

const initialState = {
  user: null,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
    logout(state) {
      state.user = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, () => initialState);
  },
});

export const { setLoading, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
