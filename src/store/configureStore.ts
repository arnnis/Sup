import {createStore, applyMiddleware, Middleware} from 'redux';
import thunk from 'redux-thunk';
import {createLogger} from 'redux-logger';
import {persistStore, persistReducer} from 'redux-persist';
import persistConfig from './persistConfig';
import rootReducer from '../reducers';

function configureStore() {
  let middlewares: Middleware[] = [];
  middlewares.push(thunk);

  if (__DEV__) {
    // const logger = createLogger({
    //   level: 'info',
    //   collapsed: true,
    // });
    // middlewares.push(logger);
  }

  const enhancer = applyMiddleware(...middlewares);
  const persistedReducer = persistReducer(persistConfig, rootReducer);

  let store = createStore(persistedReducer, enhancer);
  let persistor = persistStore(store);

  return {store, persistor};
}

export default configureStore;
