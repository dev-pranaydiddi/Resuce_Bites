import { createSlice } from '@reduxjs/toolkit';
import { PURGE } from 'redux-persist';

const donationInitialState = {
  allDonations: [],
  myDonations: [],
  singleDonation: null,
  loading: false,
};

const donationSlice = createSlice({
  name: 'donation',
  initialState: donationInitialState,
  reducers: {
    setAllDonations(state, action) {
      state.allDonations = action.payload;
    },
    setMyDonations(state, action) {
      state.myDonations = action.payload;
    },
    setSingleDonation(state, action) {
      state.singleDonation = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, () => donationInitialState);
  },
});

export const {
  setAllDonations,
  setMyDonations,
  setSingleDonation,
  setLoading,
} = donationSlice.actions;
export default donationSlice.reducer;
