import {createLogger} from 'redux-logger';
import {persistStore, persistReducer} from 'redux-persist';
import {
  configureStore as RTKConfigureStore,
  getDefaultMiddleware,
  ThunkAction,
  Action,
} from '@reduxjs/toolkit';
import {combineReducers} from 'redux';
import persistConfig from './persistConfig';

import {entitiesReducer} from '../slices/entities-slice';
import {teamsReducer} from '../slices/teams-slice';
import {appReducer} from './../slices/app-slice';
import {chatsReducer} from '../slices/chats-slice';
import {messagesReducer} from '../slices/messages-slice';
import {membersReducer} from '../slices/members-slice';
import {filesReducer} from '../slices/files-slice';

const rootReducer = combineReducers({
  entities: entitiesReducer,
  messages: messagesReducer,
  chats: chatsReducer,
  members: membersReducer,
  app: appReducer,
  teams: teamsReducer,
  files: filesReducer,
});

const persistedReducer = persistReducer<RootState>(persistConfig, rootReducer);

const logger = createLogger();

const middlewares = [
  ...getDefaultMiddleware({
    serializableCheck: false,
    // immutableCheck: false,
  }),
  logger,
];

export const store = RTKConfigureStore({
  reducer: persistedReducer,
  middleware: middlewares,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
