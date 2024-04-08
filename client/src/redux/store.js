import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

import rootReducer from './reducers/index';

// Configuration for persisting the Redux store
const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the Redux store with the persisted reducer
const store = configureStore({
  reducer: persistedReducer,
});

// Create the persisted Redux store
const persistor = persistStore(store);

export { store, persistor };