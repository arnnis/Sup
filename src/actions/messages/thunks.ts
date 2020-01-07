import {getMessagesStart, getMessagesFail, getMessagesSuccess} from '.';
import {batch} from 'react-redux';
import {storeEntities, updateEntity} from '../entities';
import {Message, PaginationResult, MessageReaction} from '../../models';
import http from '../../utils/http';
import {RootState} from '../../reducers';
import {getMember, getMembersByUserIds} from '../members/thunks';
import {SlackError} from '../../utils/errors';

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
    store.messages.nextCursor[threadId] && store.messages.nextCursor[threadId] === 'end';
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

    messages = messages.filter(msg => msg.ts !== threadId);

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

export const removeReactionRequest = (
  emojiName: string,
  messageId?: string,
  fileId?: string,
  fileCommentId?: string,
) => async (dispatch, getState) => {
  const state: RootState = getState();
  if (!state.chats.currentChatId) return;

  let result: {messages: Array<Message>} & {ok: boolean} = await http({
    path: '/reactions.remove',
    body: {
      name: emojiName,
      timestamp: messageId || null,
      channel: state.chats.currentChatId || undefined,
    },
  });

  if (result.ok) return true;

  return false;
};

export const addReactionRequest = (
  emojiName: string,
  messageId?: string,
  fileId?: string,
  fileCommentId?: string,
) => async (dispatch, getState) => {
  const state: RootState = getState();
  if (!state.chats.currentChatId) return;
  try {
    let result: {messages: Array<Message>} & {ok: boolean} = await http({
      path: '/reactions.add',
      body: {
        name: emojiName,
        timestamp: messageId || undefined,
        channel: state.chats.currentChatId || undefined,
      },
    });
    if (result.ok) return true;

    return false;
  } catch (err) {
    if (err instanceof SlackError) {
      if (err.message === 'already_reacted' || err.message === 'no_reaction') {
        // possible race condition. do nothing
      }
    }
  }
};

export const addReaction = (name: string, user: string, messageId: string) => (
  dispatch,
  getState,
) => {
  const state: RootState = getState();
  let message = state.entities.messages.byId[messageId];

  // Message not loaded. so no need to update reaction
  if (!message) return;

  let reactions = message.reactions;

  const reaction = message.reactions?.find(reaction => reaction.name === name);

  if (reaction && reaction.users.includes(user)) return;

  // Reaction already exist. so only increase count
  if (reaction)
    dispatch(
      updateEntity('messages', messageId, {
        reactions: reactions.map(r =>
          r.name === name
            ? {
                ...r,
                count: r.count + 1,
                users: [...r.users, user],
              }
            : r,
        ),
      }),
    );
  else
    dispatch(
      updateEntity('messages', messageId, {
        reactions: [...(reactions || []), {name: name, users: [user], count: 1}],
      }),
    );
};

export const removeReaction = (name: string, user: string, messageId: string) => (
  dispatch,
  getState,
) => {
  const state: RootState = getState();

  let message = state.entities.messages.byId[messageId];
  // Message not loaded. so no need to update reaction
  if (!message) return;

  const reactions = message.reactions;

  const reaction = message.reactions?.find(reaction => reaction.name === name);

  // Check reaction exists
  if (!reaction) return;

  if (!reaction.users.includes(user)) return;

  // Count is 1, so we should remove reaction object, otherwise decrease count by 1
  if (reaction.count === 1)
    dispatch(
      updateEntity('messages', messageId, {
        reactions: reactions.filter(reaction => reaction.name !== name),
      }),
    );
  else
    dispatch(
      updateEntity('messages', messageId, {
        reactions: reactions.map(reaction =>
          reaction.name === name
            ? {
                ...reaction,
                count: reaction.count - 1,
                users: reaction.users.filter(user => user !== user),
              }
            : reaction,
        ),
      }),
    );
};
