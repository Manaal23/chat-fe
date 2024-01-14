/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

const initialState = {
  authState: false,
  authUser: {},
  usersList: [],
  selectedUser: {},
  blockDetails: {},
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthState(state, action) {
      state.authState = action.payload;
    },
    setAuthUser(state, action) {
      state.authUser = { ...action.payload };
    },
    setUsersList(state, action) {
      state.usersList = [...action.payload.users];
    },
    setSelectedUser(state, action) {
      state.selectedUser = action.payload;
    },
    setBlockDetails(state, action) {
      state.blockDetails = { ...action.payload };
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => ({
      ...state,
      ...action.payload.auth,
    }),
  },
});

export const {
  setAuthState,
  setAuthUser,
  setUsersList,
  setSelectedUser,
  setBlockDetails,
} = authSlice.actions;
export const selectAuthState = (state) => state?.auth;
export default authSlice.reducer;
