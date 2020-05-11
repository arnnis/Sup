import {send} from '.';
import {PresencesQueryRequest, PresenceChangeEvent, PresenceSubscribeRequest} from './types';
import {store} from '../../store/configureStore';
import {updateEntity} from '../../slices/entities-slice';
import {RootState} from '../../reducers';

export const queryPresences = (userIds: Array<string>) => {
  if (!userIds || !userIds.length) return;
  const data: PresencesQueryRequest = {
    type: 'presence_query',
    ids: userIds,
  };
  send(data);
};

export const subscribePresence = (userIds: string[]) => {
  if (!userIds || !userIds.length) return;
  const data: PresenceSubscribeRequest = {
    type: 'presence_sub',
    ids: userIds,
  };
  send(data);
};

export const handleUserPresenceChange = (data: PresenceChangeEvent) => {
  let {user: userId, presence} = data;
  // Check presense has changed, Then update user entity
  const state: RootState = store.getState();
  const currentPresence = state.entities.users.byId[userId]?.presence ?? 'away';
  if (currentPresence !== presence) {
    store.dispatch(updateEntity({entity: 'users', key: userId, data: {presence}}));
    console.log('presence updated, user:', userId);
  }
};
