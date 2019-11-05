import {getMessagesStart, getMessagesFail, getMessagesSuccess} from '.';
import {batch} from 'react-redux';
import {storeEntities} from '../entities';
import {Message, PaginationResult} from '../../models';
import http from '../../utils/http';
import {RootState} from '../../reducers';
import {getMember, getMembersByUserIds} from '../members/thunks';

export const getMessagesByChatId = (chatId: string) => async (dispatch, getState) => {
  let store: RootState = getState();
  let messageList = store.messages.list[chatId] || [];
  let cursor = messageList[messageList.length - 1] || '';
  let hasNextPage =
    store.messages.nextCursor[chatId] && store.messages.nextCursor[chatId] === 'end';
  let alreadyLoading = store.messages.loading[chatId];
  if (hasNextPage || alreadyLoading) return;

  try {
    dispatch(getMessagesStart(chatId));
    let {messages, response_metadata}: {messages: Array<Message>} & PaginationResult = await http({
      path: '/conversations.history',
      body: {
        channel: chatId,
        limit: 50,
        latest: cursor,
      },
    });

    let nextCursor = response_metadata ? response_metadata.next_cursor : 'end';

    batch(() => {
      dispatch(getMessagesSuccess(chatId, messages, nextCursor));
      dispatch(storeEntities('messages', messages));
    });

    return Promise.resolve(messages);
  } catch (err) {
    console.log(err);
    dispatch(getMessagesFail(chatId));
    return Promise.reject(err);
  }
};

export const getRepliesByThreadId = (threadId: string, chatId: string) => async (
  dispatch,
  getState,
) => {
  let store: RootState = getState();
  let messageList = store.messages.list[threadId] || [];
  let cursor = messageList[messageList.length - 1];
  let hasNextPage =
    store.messages.nextCursor[chatId] && store.messages.nextCursor[chatId] === 'end';
  let alreadyLoading = store.messages.loading[threadId];
  if (hasNextPage || alreadyLoading) return;

  try {
    dispatch(getMessagesStart(threadId));
    let {messages, response_metadata}: {messages: Array<Message>} & PaginationResult = await http({
      path: '/conversations.replies',
      body: {
        channel: chatId,
        ts: threadId,
        limit: 41,
        oldest: cursor || threadId,
      },
    });

    let nextCursor = response_metadata ? response_metadata.next_cursor : 'end';

    batch(() => {
      dispatch(getMessagesSuccess(threadId, messages, nextCursor));
      dispatch(storeEntities('messages', messages));
    });

    return Promise.resolve(messages);
  } catch (err) {
    console.log(err);
    dispatch(getMessagesFail(threadId));
    return Promise.reject(err);
  }
};

export const setReaction = (
  emojiName: string,
  messageId?: string,
  fileId?: string,
  fileCommentId?: string,
) => async dispatch => {
  let x: {messages: Array<Message>} & PaginationResult = await http({
    path: '/reactions.add',
    body: {
      name: emojiName,
      timestamp: messageId,
      file: fileId,
      file_comment: fileCommentId,
    },
  });
  debugger;
  return x;
};
