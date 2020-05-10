import {ActionType} from 'typesafe-actions';
import * as appActions from '../slices/app-slice';
// import * as directsActions from './chats';
import * as teamActions from './teams';
import * as messagesActions from '../slices/messages-slice';
import * as membersActions from './members';
import * as filesActions from '../slices/files-slice';
import * as entitiesActions from './entities';

export type RootAction = ActionType<
  typeof appActions &
    // typeof directsActions &
    typeof teamActions &
    typeof entitiesActions &
    typeof messagesActions &
    typeof membersActions &
    typeof filesActions
>;
