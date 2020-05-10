import {ActionType} from 'typesafe-actions';
import * as appActions from '../slices/app-slice';
import * as directsActions from '../slices/chats-slice';
import * as teamActions from '../slices/teams-slice';
import * as messagesActions from '../slices/messages-slice';
import * as membersActions from '../slices/members-slice';
import * as filesActions from '../slices/files-slice';
import * as entitiesActions from '../slices/entities-slice';

export type RootAction = ActionType<
  typeof appActions &
    typeof directsActions &
    typeof teamActions &
    typeof entitiesActions &
    typeof messagesActions &
    typeof membersActions &
    typeof filesActions
>;
