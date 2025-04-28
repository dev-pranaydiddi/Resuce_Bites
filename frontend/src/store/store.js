// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import authReducer from './authSlice';
import donationReducer from './donationSlice';
import requestReducer from './requestSlice';  // renamed for consistency
import deliveryReducer from './deliverySlice';

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

const persistConfig = {
  key: 'root',
  storage,
  // now persisting auth, donation AND request slices
  whitelist: ['auth', 'donation', 'request','delivery'],
};

// combine all your slice reducers
const rootReducer = combineReducers({
  auth: authReducer,
  donation: donationReducer,
  request: requestReducer,
  delivery: deliveryReducer,
});

// wrap with redux-persist
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // ignore redux-persist action types so middleware won't warn
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
