import { combineReducers, configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import createFilter from 'redux-persist-transform-filter';

import userReducer from './slices/user';

const saveUserOnlyFilter = createFilter('user', ['user']);

// persist config
const persistConfig = {
  key: 'user',
  storage,
  whitelist: ['user'],
  transforms: [saveUserOnlyFilter],
};

const rootReducer = combineReducers({
  user: userReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
  devTools: true,
});

export const persistor = persistStore(store);
