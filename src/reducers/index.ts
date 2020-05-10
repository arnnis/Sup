import {combineReducers} from 'redux';

import {entitiesReducer} from './entities';
import {teamsReducer} from './teams';
import {appReducer} from './../slices/app-slice';
import {chatsReducer} from '../slices/chats-slice';
import {messagesReducer} from '../slices/messages-slice';
import {membersReducer} from './members';
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

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
