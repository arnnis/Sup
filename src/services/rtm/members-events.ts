import {socket} from '.';
import {PresencesQueryRequest, PresenceChangeEvent} from './types';
import {store} from '../../App';
import {updateEntity} from '../../actions/entities';

export const queryPresences = (userIds: Array<string>) => {
  if (!userIds || !userIds.length) return;
  const data: PresencesQueryRequest = {
    type: 'presence_query',
    ids: userIds,
  };
  socket && socket.send(JSON.stringify(data));
};

export const handleUserPresenceChange = (data: PresenceChangeEvent) => {
  let {user: userId, presence} = data;
  store.dispatch(updateEntity('users', userId, {presence}));
  console.log('presence updated, user:', userId);
};
