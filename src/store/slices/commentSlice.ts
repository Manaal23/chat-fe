import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

const initialState = {
  value: [
    {
      username: '',
    }
  ],
};

export const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    // Action to add comment
    addComment: (state, action) => {
      state.value = [...state.value, action.payload];
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.auth,
      };
    },
  },
});

export const { addComment } = commentSlice.actions;
export const selectComments = (state) => state.comments.value;
export default commentSlice.reducer;