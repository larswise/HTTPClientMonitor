import { configureStore } from '@reduxjs/toolkit';
import messagesReducer from './messagesSlice';

export const store = configureStore({
  reducer: {
    messages: messagesReducer,
  },
  // devTools enabled by default in non-prod
});

// App-wide types
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;