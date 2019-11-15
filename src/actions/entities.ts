import {action} from 'typesafe-actions';
import {User, Chat, Message, Team} from '../models';

type EntityType = 'users' | 'chats' | 'messages' | 'pendingMessages' | 'teams' | 'files' | 'emojis';

export const storeEntities = (
  entity: EntityType,
  data: (User & Chat & Message & Team)[] | object,
) => {
  if (Array.isArray(data)) {
    data = data.reduce(
      (preValue, curValue) => ({
        ...preValue,
        [curValue.id || curValue.ts]: curValue,
      }),
      {},
    );
  }

  return action('STORE_ENTITIES', {entity, data});
};

export const updateEntity = (entity: EntityType, key: string, data: object) =>
  action('UPDATE_ENTITY', {entity, key, data});
