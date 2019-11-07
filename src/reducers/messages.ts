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

    // Adds a message to a chat (regular chat or thread)
    case 'ADD_MESSAGE_TO_CHAT': {
      let {chatId, messageId, threadId} = action.payload;

      // Check for possible duplication in list
      if ((state.list[threadId || chatId] || []).includes(messageId)) return state;

      // pagination must be ended for this thread: if not it will break pagination. (pagination uses last message ts to load older messages)
      if (threadId && state.nextCursor[threadId] !== 'end') return;

      // When message is for a thread,
      // we add the message to end of array,
      // because thread list is not reverted in ui.
      if (threadId)
        return {
          ...state,
          list: {
            ...state.list,
            [threadId]: [...(state.list[threadId] || []), messageId],
          },
        };

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
      let threadId = message.thread_ts;

      if (threadId)
        return {
          ...state,
          list: {
            ...state.list,
            [threadId]: [...(state.list[threadId] || []), message.id],
          },
        };

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
      return initialState;
    }

    default:
      return state;
  }
};
