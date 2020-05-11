import {User, Team, Chat, Message, PendingMessage, MessageAttachement} from '../models';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import merge from 'lodash/merge';
import {setCurrentTeam} from './teams-slice';

type EntityType = 'users' | 'chats' | 'messages' | 'teams' | 'files' | 'emojis';

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

const entitiesSlice = createSlice({
  name: 'entities',
  initialState,
  reducers: {
    storeEntities(
      state,
      action: PayloadAction<{entity: EntityType; data: (User & Chat & Message & Team)[] | object}>,
    ) {
      let {entity, data} = action.payload;
      if (Array.isArray(data)) {
        data = data.reduce(
          (preValue, curValue) => ({
            ...preValue,
            // note: ts is the id in messages in Slack
            [curValue.id || curValue.ts]: curValue,
          }),
          {},
        );
      }

      if (!data) return;

      state[entity].byId = merge(state[entity].byId, data);
    },
    updateEntity(state, action: PayloadAction<{entity: EntityType; key: string; data: object}>) {
      let {entity, key, data} = action.payload;
      if (!data) return;

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
    },
  },
  extraReducers: (b) => {
    b.addCase(setCurrentTeam, () => {
      return initialState;
    });
  },
});

export const entitiesReducer = entitiesSlice.reducer;

export const {storeEntities, updateEntity} = entitiesSlice.actions;
