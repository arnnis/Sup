import {Reducer} from 'redux';
import {RootAction} from '../actions';
import {createSelector} from 'reselect';
import {RootState} from '.';

export type ChatsState = Readonly<{
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
  membersListLoadStatus: {[chatId: string]: {loading: boolean; nextCursor: string}};
}>;

const initialState: ChatsState = {
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
  membersListLoadStatus: {},
};

export const chatsReducer: Reducer<ChatsState, RootAction> = (state = initialState, action) => {
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
        typingsUsers: {
          ...state.typingsUsers,
          [chatId]: [...(state.typingsUsers[chatId] || []), userId],
        },
      };
    }

    case 'UNSET_USER_TYPING': {
      let {chatId, userId} = action.payload;
      return {
        ...state,
        typingsUsers: {
          ...state.typingsUsers,
          [chatId]: state.typingsUsers[chatId].filter(uId => uId !== userId),
        },
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
        membersListLoadStatus: {
          ...state.membersListLoadStatus,
          [chatId]: {
            ...state.membersListLoadStatus[chatId],
            loading: true,
          },
        },
      };
    }

    case 'GET_CHANNEL_MEMBERS_SUCCESS': {
      let {chatId, members, nextCursor} = action.payload;
      return {
        ...state,
        membersList: {
          ...state.membersList,
          [chatId]: [...(state.membersList[chatId] || []), ...members],
        },
        membersListLoadStatus: {
          ...state.membersListLoadStatus,
          [chatId]: {
            loading: false,
            nextCursor,
          },
        },
      };
    }

    case 'GET_CHANNEL_MEMBERS_FAIL': {
      let {chatId} = action.payload;
      return {
        ...state,
        membersListLoadStatus: {
          ...state.membersListLoadStatus,
          [chatId]: {
            ...state.membersListLoadStatus[chatId],
            loading: false,
          },
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

export const totalDirectsUnreadCountSelector = createSelector(
  [(state: RootState) => state.chats.directsList, (state: RootState) => state.entities.chats],
  (directsList, chatsEntities) =>
    directsList
      .map(chatId => chatsEntities.byId[chatId])
      .reduce((acc, cur) => acc + cur.dm_count, 0),
);

export const totalChannelsUnreadCountSelector = createSelector(
  [(state: RootState) => state.chats.channelsList, (state: RootState) => state.entities.chats],
  (directsList, chatsEntities) =>
    directsList
      .map(chatId => chatsEntities.byId[chatId])
      .reduce((acc, cur) => acc + cur.unread_count, 0),
);
