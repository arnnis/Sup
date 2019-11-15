import {combineReducers} from 'redux';

import {entitiesReducer} from './entities';
import {teamsReducer} from './teams';
import {appReducer} from './app';
import {chatsReducer} from './chats';
import {messagesReducer} from './messages';
import {membersReducer} from './members';
import {filesReducer} from './files';

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
