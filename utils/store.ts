import { configureStore } from '@reduxjs/toolkit';
import { downloadReducer } from './reducers'; // Make sure this path is correct

const store = configureStore({
  reducer: {
    downloadingChapters: downloadReducer,
  },
});

export default store;