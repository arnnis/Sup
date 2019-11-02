import {Reducer} from 'redux';
import {RootAction} from '../actions';

export type DirectsState = Readonly<{
  currentChatId: string;
  currentThreadId: string;
  directsList: Array<string>;
  channelsList: Array<string>;
  loading: boolean;
  lastMessages: {
    [directId: string]: {loading: boolean; messageId?: string};
  };
  nextCursor: string;
  typingsUsers: {[chatId: string]: Array<string>};
  fullLoad: {[chatId: string]: {loading: boolean; loaded: boolean}};
  membersList: {[chatId: string]: Array<string>};
  membersListLoading: {[chatId: string]: boolean};
}>;

const initialState: DirectsState = {
  currentChatId: '',
  currentThreadId: '',
  directsList: [],
  channelsList: [],
  loading: false,
  lastMessages: {},
  nextCursor: '',
  typingsUsers: {},
  fullLoad: {},
  membersList: {},
  membersListLoading: {},
};

export const chatsReducer: Reducer<DirectsState, RootAction> = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_CHATS_START': {
      return {
        ...state,
        loading: true,
      };
    }

    case 'FETCH_CHATS_SUCCESS': {
      let {ims, groups} = action.payload;
      return {
        ...state,
        directsList: ims.map(im => im.id),
        channelsList: groups.map(group => group.id),
        loading: false,
      };
    }

    case 'FETCH_CHATS_FAIL': {
      return {
        ...state,
        loading: false,
      };
    }

    case 'GET_CHAT_LAST_MESSAGE_START': {
      let {directId} = action.payload;
      return {
        ...state,
        lastMessages: {
          ...state.lastMessages,
          [directId]: {
            loading: true,
          },
        },
      };
    }

    case 'GET_CHAT_LAST_MESSAGE_SUCCESS': {
      let {directId, messageId, nextCursor} = action.payload;
      return {
        ...state,
        lastMessages: {
          ...state.lastMessages,
          [directId]: {
            loading: false,
            messageId,
          },
        },
        nextCursor,
      };
    }

    case 'GET_CHAT_LAST_MESSAGE_FAIL': {
      let {directId} = action.payload;
      return {
        ...state,
        lastMessages: {
          ...state.lastMessages,
          [directId]: {
            loading: false,
          },
        },
      };
    }

    case 'ADD_MESSAGE_TO_CHAT': {
      let {chatId, messageId} = action.payload;
      return {
        ...state,
        lastMessages: {
          ...state.lastMessages,
          [chatId]: {
            loading: false,
            messageId,
          },
        },
      };
    }

    case 'SET_USER_TYPING': {
      let {chatId, userId} = action.payload;
      return {
        ...state,
      };
    }

    case 'SET_CURRENT_CHAT': {
      let {chatId} = action.payload;
      return {
        ...state,
        currentChatId: chatId,
      };
    }

    case 'SET_CURRENT_THREAD': {
      let {threadId} = action.payload;
      return {
        ...state,
        currentThreadId: threadId,
      };
    }

    case 'GET_CHAT_INFO_START': {
      let {chatId} = action.payload;
      return {
        ...state,
        fullLoad: {
          ...state.fullLoad,
          [chatId]: {
            loading: true,
            loaded: false,
          },
        },
      };
    }

    case 'GET_CHAT_INFO_SUCCESS': {
      let {chatId} = action.payload;
      return {
        ...state,
        fullLoad: {
          ...state.fullLoad,
          [chatId]: {
            loading: false,
            loaded: true,
          },
        },
      };
    }

    case 'GET_CHAT_INFO_FAIL': {
      let {chatId} = action.payload;
      return {
        ...state,
        fullLoad: {
          ...state.fullLoad,
          [chatId]: {
            loading: false,
            loaded: false,
          },
        },
      };
    }

    case 'GET_CHANNEL_MEMBERS_START': {
      let {chatId} = action.payload;
      return {
        ...state,
        membersListLoading: {
          ...state.fullLoad,
          [chatId]: true,
        },
      };
    }

    case 'GET_CHANNEL_MEMBERS_SUCCESS': {
      let {chatId, members} = action.payload;
      return {
        ...state,
        membersList: {
          ...state.membersList,
          [chatId]: [...(state.membersList[chatId] || []), ...members],
        },
        membersListLoading: {
          ...state.fullLoad,
          [chatId]: false,
        },
      };
    }

    case 'GET_CHANNEL_MEMBERS_FAIL': {
      let {chatId} = action.payload;
      return {
        ...state,
        membersListLoading: {
          ...state.fullLoad,
          [chatId]: false,
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
