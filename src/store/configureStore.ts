import {createLogger} from 'redux-logger';
import {persistStore, persistReducer} from 'redux-persist';
import {
  configureStore as _configureStore,
  getDefaultMiddleware,
  ThunkAction,
  Action,
} from '@reduxjs/toolkit';
import persistConfig from './persistConfig';
import rootReducer, {RootState} from '../reducers';

function configureStore() {
  const persistedReducer = persistReducer(persistConfig, rootReducer);

  const store = _configureStore({
    reducer: persistedReducer,
    middleware: [
      ...getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false,
      }),
      createLogger(),
    ],
  });
  let persistor = persistStore(store);

  return {store, persistor};
}

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export default configureStore;
