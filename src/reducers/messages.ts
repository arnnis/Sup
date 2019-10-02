import {Reducer} from 'redux';
import {RootAction} from '../actions';
import {PendingMessage} from '../models';

export type MessagesState = Readonly<{
  list: {[chatId: string]: Array<string>};
  loading: {[chatId: string]: boolean};
  nextCursor: {[chatId: string]: string};
  pendingMessages: {
    [chatId: string]: Array<PendingMessage>;
  };
}>;

const initialState: MessagesState = {
  list: {},
  loading: {},
  nextCursor: {},
  pendingMessages: {},
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
          [chatId]: [
            ...(state.list[chatId] || []),
            ...messages.map(msg => msg.ts),
          ],
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
        pendingMessages: {
          ...state.pendingMessages,
          [chatId]: [...(state.pendingMessages[chatId] || []), message],
        },
      };
    }

    case 'REMOVE_PENDING_MESSAGE': {
      let {pendingId, chatId} = action.payload;
      return {
        ...state,
        pendingMessages: {
          ...state.pendingMessages,
          [chatId]: state.pendingMessages[chatId].filter(
            pendingMessage => pendingMessage.id !== pendingId,
          ),
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
