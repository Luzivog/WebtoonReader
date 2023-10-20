import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import { downloadReducer } from './reducers'; // Make sure this path is correct

const store = configureStore({
  reducer: {
    downloadingChapters: downloadReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export default store;
