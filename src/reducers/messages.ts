import {Reducer} from 'redux';
import {RootAction} from '../actions';

export type MessagesState = Readonly<{
  list: {[chatIdOrThreadId: string]: Array<string | number>}; // Number for pending message local fingerprint, string for regular messages
  loading: {[chatIdOrThreadId: string]: boolean};
  nextCursor: {[chatId: string]: string};
}>;

const initialState: MessagesState = {
  list: {},
  loading: {},
  nextCursor: {},
};

export const messagesReducer: Reducer<MessagesState, RootAction> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case 'GET_MESSAGES_START': {
      let {chatId} = action.payload;
      return {
        ...state,
        loading: {
          ...state.loading,
          [chatId]: true,
        },
      };
    }

    case 'GET_MESSAGES_SUCCESS': {
      let {chatId, messages, nextCursor} = action.payload;
      return {
        ...state,
        list: {
          ...state.list,
          [chatId]: [...(state.list[chatId] || []), ...messages.map(msg => msg.ts)],
        },
        loading: {
          ...state.loading,
          [chatId]: false,
        },
        nextCursor: {
          ...state.nextCursor,
          [chatId]: nextCursor,
        },
      };
    }

    case 'GET_MESSAGES_FAIL': {
      let {chatId} = action.payload;
      return {
        ...state,
        loading: {
          ...state.loading,
          [chatId]: false,
        },
      };
    }

    case 'ADD_MESSAGE_TO_CHAT': {
      let {chatId, messageId} = action.payload;

      if ((state.list[chatId] || []).includes(messageId)) return state;

      return {
        ...state,
        list: {
          ...state.list,
          [chatId]: [messageId, ...(state.list[chatId] || [])],
        },
      };
    }

    case 'GET_CHAT_LAST_MESSAGE_SUCCESS': {
      let {nextCursor, directId} = action.payload;
      return {
        ...state,
        nextCursor: {
          ...state.nextCursor,
          [directId]: nextCursor,
        },
      };
    }

    case 'ADD_PENDING_MESSAGE': {
      let {message} = action.payload;
      let chatId = message.channel;
      return {
        ...state,
        list: {
          ...state.list,
          [chatId]: [message.id, ...(state.list[chatId] || [])],
        },
      };
    }

    case 'REMOVE_PENDING_MESSAGE': {
      let {pendingId, chatId} = action.payload;
      return {
        ...state,
        list: {
          ...state.list,
          [chatId]: state.list[chatId].filter(id => id !== pendingId),
        },
      };
    }

    case 'SET_CURRENT_TEAM': {
      return {
        ...state,
        list: {},
        loading: {},
        nextCursor: {},
        pendingMessages: {},
      };
    }

    default:
      return state;
  }
};
