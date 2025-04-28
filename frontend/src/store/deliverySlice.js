import { createSlice } from '@reduxjs/toolkit';
import { PURGE } from 'redux-persist';

const deliverySlice = createSlice({
  name: 'delivery',
  initialState: {
    allDeliveries: [],
    myDeliveries: [],
    loading: false,
  },
  reducers: {
    setAllDeliveries: (state, action) => {
      state.allDeliveries = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    addToMyDeliveries: (state, action) => {
      state.allDeliveries = state.allDeliveries.filter(
        (delivery) => delivery._id !== action.payload
      );
    },
    setMyDeliveries: (state, action) => {
      state.myDeliveries = action.payload;
    },
  },
   extraReducers: (builder) => {
      builder.addCase(PURGE, () => donationInitialState);
    },
});

export const { setAllDeliveries, setLoading, addToMyDeliveries,setMyDeliveries } = deliverySlice.actions;
export default deliverySlice.reducer;
