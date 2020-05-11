import {createSlice, PayloadAction, createSelector} from '@reduxjs/toolkit';
import {Chat} from '../models';
import {setCurrentTeam} from './teams-slice';
import {RootState} from '../store/configureStore';

export type ChatsState = {
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
};

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

const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    fetchChatsStart: (state) => {
      state.loading = true;
    },
    fetchChatsSuccess(
      state,
      action: PayloadAction<{ims: Chat[]; groups: Chat[]; nextCursor: string}>,
    ) {
      let {ims, groups} = action.payload;
      state.channelsList = groups.map((group) => group.id);
      state.directsList = ims.map((im) => im.id);
      state.loading = false;
    },
    fetchChatsFail(state) {
      state.loading = false;
    },

    getLastMessageStart(state, action: PayloadAction<{directId: string}>) {
      state.lastMessages[action.payload.directId] = {
        ...state.lastMessages[action.payload.directId],
        loading: true,
      };
    },
    getLastMessageSuccess(
      state,
      action: PayloadAction<{directId: string; messageId: string; nextCursor: string}>,
    ) {
      let {directId, messageId} = action.payload;
      state.lastMessages[directId] = {
        loading: false,
        messageId,
      };
      // state.nextCursor = nextCursor
    },
    getLastMessageFail(state, action: PayloadAction<{directId: string}>) {
      state.lastMessages[action.payload.directId] = {
        ...state.lastMessages[action.payload.directId],
        loading: false,
      };
    },
    setUserTyping(state, action: PayloadAction<{userId: string; chatId: string}>) {
      const {chatId, userId} = action.payload;
      if (state.typingsUsers[chatId]) state.typingsUsers[chatId].push(userId);
      else state.typingsUsers[chatId] = [userId];
    },
    unsetUserTyping(state, action: PayloadAction<{userId: string; chatId: string}>) {
      const {chatId, userId} = action.payload;
      if (state.typingsUsers[chatId]?.includes(userId)) {
        state.typingsUsers[chatId].splice(state.typingsUsers[chatId].indexOf(userId), 1);
      }
    },
    setCurrentChat(state, action: PayloadAction<{chatId: string}>) {
      state.currentChatId = action.payload.chatId;
    },
    setCurrentThread(state, action: PayloadAction<{threadId: string}>) {
      state.currentThreadId = action.payload.threadId;
    },

    getChatInfoStart(state, action: PayloadAction<{chatId: string}>) {
      const {chatId} = action.payload;
      state.fullLoad[chatId] = {
        loading: true,
        loaded: false,
      };
    },
    getChatInfoSuccess(state, action: PayloadAction<{chatId: string; chat: Chat}>) {
      const {chatId} = action.payload;
      state.fullLoad[chatId] = {
        loading: false,
        loaded: true,
      };
    },
    getChatInfoFail(state, action: PayloadAction<{chatId: string}>) {
      const {chatId} = action.payload;
      state.fullLoad[chatId] = {
        loading: false,
        loaded: false,
      };
    },

    getChannelMembersStart(state, action: PayloadAction<{chatId: string}>) {
      let {chatId} = action.payload;
      state.membersListLoadStatus[chatId] = {
        ...state.membersListLoadStatus[chatId],
        loading: true,
      };
    },
    getChannelMembersSuccess(
      state,
      action: PayloadAction<{
        chatId: string;
        members: Array<string>;
        nextCursor: string;
      }>,
    ) {
      let {chatId, members, nextCursor} = action.payload;
      state.membersList[chatId] = [...(state.membersList[chatId] || []), ...members];
      state.membersListLoadStatus[chatId] = {
        loading: false,
        nextCursor,
      };
    },
    getChannelMembersFail(state, action: PayloadAction<{chatId: string}>) {
      let {chatId} = action.payload;
      state.membersListLoadStatus[chatId]['loading'] = false;
    },
  },
  extraReducers: (b) => {
    b.addCase(setCurrentTeam, () => {
      return initialState;
    });
  },
});

export const chatsReducer = chatsSlice.reducer;

export const {
  fetchChatsStart,
  fetchChatsSuccess,
  fetchChatsFail,
  getLastMessageStart,
  getLastMessageSuccess,
  getLastMessageFail,
  setUserTyping,
  unsetUserTyping,
  setCurrentChat,
  setCurrentThread,
  getChatInfoStart,
  getChatInfoSuccess,
  getChatInfoFail,
  getChannelMembersFail,
  getChannelMembersStart,
  getChannelMembersSuccess,
} = chatsSlice.actions;

export const totalDirectsUnreadCountSelector = createSelector(
  [(state: RootState) => state.chats.directsList, (state: RootState) => state.entities.chats],
  (directsList, chatsEntities) =>
    directsList
      .map((chatId) => chatsEntities.byId[chatId])
      .reduce((acc, cur) => acc + cur.dm_count, 0),
);

export const totalChannelsUnreadCountSelector = createSelector(
  [(state: RootState) => state.chats.channelsList, (state: RootState) => state.entities.chats],
  (directsList, chatsEntities) =>
    directsList
      .map((chatId) => chatsEntities.byId[chatId])
      .reduce((acc, cur) => acc + cur.unread_count, 0),
);
