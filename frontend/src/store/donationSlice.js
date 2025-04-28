import { createSlice } from '@reduxjs/toolkit';
import { PURGE } from 'redux-persist';

const donationInitialState = {
  allDonations: [],
  allUserDonations: [],
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
    setAllUserDonations(state, action) {
      state.allUserDonations = action.payload;
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
  setAllUserDonations,
  setSingleDonation,
  setLoading,
} = donationSlice.actions;
export default donationSlice.reducer;
