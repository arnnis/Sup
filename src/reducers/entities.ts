import {Reducer} from 'redux';
import merge from 'lodash/merge';
import {RootAction} from '../actions';
import {User, Message, Chat, Team, PendingMessage, MessageAttachement} from '../models';

export type EntitiesState = Readonly<{
  users: {byId: {[userId: string]: User}};
  teams: {byId: {[teamId: string]: Team}};
  chats: {byId: {[chatId: string]: Chat}};
  messages: {byId: {[messageId: string]: Message | PendingMessage}};
  files: {byId: {[fileId: string]: MessageAttachement}};
  emojis: {byId: {[emojiId: string]: string}};
}>;

const initialState: EntitiesState = {
  users: {byId: {}},
  teams: {byId: {}},
  chats: {byId: {}},
  messages: {byId: {}},
  files: {byId: {}},
  emojis: {byId: {}},
};

export const entitiesReducer: Reducer<EntitiesState, RootAction> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case 'STORE_ENTITIES': {
      let {entity, data} = action.payload;
      if (!data) return state;

      return {
        ...state,
        [entity]: {
          byId: merge(state[entity].byId, data),
        },
      };
    }

    case 'UPDATE_ENTITY': {
      let {entity, key, data} = action.payload;
      if (!data) return state;

      return {
        ...state,
        [entity]: {
          byId: {
            ...state[entity].byId,
            [key]: {
              ...(state[entity].byId[key] || {}),
              ...data,
            },
          },
        },
      };
    }

    case 'SET_CURRENT_TEAM': {
      return {
        ...initialState,
        teams: state.teams,
      };
    }

    default:
      return state;
  }
};
