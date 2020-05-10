import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Message, PendingMessage} from '../models';
import {getLastMessageSuccess} from './chats-slice';
import {setCurrentTeam} from './teams-slice';

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

const messagesSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    getMessagesStart(state, action: PayloadAction<{chatId: string}>) {
      let {chatId} = action.payload;
      state.loading[chatId] = true;
    },
    getMessagesSuccess(
      state,
      action: PayloadAction<{chatId: string; messages: Array<Message>; nextCursor: string}>,
    ) {
      let {chatId, messages, nextCursor} = action.payload;
      state.list[chatId] = [...(state.list[chatId] || []), ...messages.map((msg) => msg.ts)];
      state.loading[chatId] = false;
      state.nextCursor[chatId] = nextCursor;
    },
    getMessagesFail(state, action: PayloadAction<{chatId: string}>) {
      let {chatId} = action.payload;
      state.loading[chatId] = false;
    },

    addMessageToChat(
      state,
      action: PayloadAction<{messageId: string; chatId?: string; threadId?: string}>,
    ) {
      let {chatId, messageId, threadId} = action.payload;

      const targetId = threadId || chatId;
      if (!targetId) return;

      // Check for possible duplication in list
      if ((state.list[targetId] || []).includes(messageId)) return;

      // only add if pagination has ended for this thread: if not it will break pagination. (pagination uses last message ts to load older messages)
      if (threadId && state.nextCursor[threadId] !== 'end') return;

      // When message is for a thread,
      // we add the message to end of array,
      // because thread list is not reverted in ui.
      if (threadId) state.list[threadId] = [...(state.list[threadId] || []), messageId];
      else if (chatId) {
        state.list[chatId] = [messageId, ...(state.list[chatId] || [])];
      }
    },
    addPendingMessage(state, action: PayloadAction<{message: PendingMessage}>) {
      let {message} = action.payload;
      let chatId = message.channel;
      let threadId = message.thread_ts;

      if (threadId) {
        state.list[threadId] = [...(state.list[threadId] || []), message.id];
        return;
      }

      if (!chatId) return;
      state.list[chatId] = [message.id, ...(state.list[chatId] || [])];
    },
    removePendingMessage(state, action: PayloadAction<{pendingId: number; chatId: string}>) {
      let {pendingId, chatId} = action.payload;
      if (state.list[chatId]?.includes(pendingId))
        state.list[chatId] = state.list[chatId].filter((msgId) => msgId !== pendingId);
    },
    removeMessageFromChat(state, action: PayloadAction<{messageId: string; chatId: string}>) {
      let {chatId, messageId} = action.payload;
      if (state.list[chatId]?.includes(messageId))
        state.list[chatId] = state.list[chatId].filter((msgId) => msgId !== messageId);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getLastMessageSuccess, (state, action) => {
      let {nextCursor, directId} = action.payload;
      state.nextCursor[directId] = nextCursor;
    });
    builder.addCase(setCurrentTeam, () => {
      return initialState;
    });
  },
});

export const messagesReducer = messagesSlice.reducer;

export const {
  getMessagesStart,
  getMessagesSuccess,
  getMessagesFail,
  addMessageToChat,
  addPendingMessage,
  removePendingMessage,
  removeMessageFromChat,
} = messagesSlice.actions;
