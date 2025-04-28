import { createSlice } from '@reduxjs/toolkit';
import { PURGE } from 'redux-persist';

const initialState = {
  appliedRequests: [],   // for recipients
  applicants: [],        // for donors
  loading: false,
};

const requestSlice = createSlice({
  name: 'request',
  initialState,
  reducers: {
    // recipient populates this
    setAppliedRequests(state, action) {
      state.appliedRequests = action.payload;
    },
    // donor populates this
    setApplicants(state, action) {
      state.applicants = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },

    // Donor action: accept one → reject all the rest
    acceptRequest(state, action) {
      const acceptedId = action.payload;
      state.applicants = state.applicants.map((r) => ({
        ...r,
        status: r._id === acceptedId ? 'ACCEPTED' : 'REJECTED',
        active: false,
      }));
    },
    // (Optional) single-reject handler
    updateApplicantStatus(state, action) {
      const { id, status } = action.payload;
      const idx = state.applicants.findIndex((r) => r._id === id);
      if (idx !== -1) {
        state.applicants[idx].status = status;
        state.applicants[idx].active = false;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, () => initialState);
  },
});

export const {
  setAppliedRequests,
  setApplicants,
  setLoading,
  acceptRequest,
  updateApplicantStatus,
} = requestSlice.actions;

export default requestSlice.reducer;
