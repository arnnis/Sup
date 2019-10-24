import {action} from 'typesafe-actions';
import {Chat} from '../../models';

export const fetchChatsStart = () => action('FETCH_CHATS_START');
export const fetchChatsSuccess = (ims: Chat[], groups: Chat[], nextCursor: string) =>
  action('FETCH_CHATS_SUCCESS', {ims, groups, nextCursor});
export const fetchChatsFail = () => action('FETCH_CHATS_FAIL');

export const getChatLastMessageStart = (directId: string) =>
  action('GET_CHAT_LAST_MESSAGE_START', {directId});
export const getChatLastMessageSuccess = (
  directId: string,
  messageId: string,
  nextCursor: string,
) => action('GET_CHAT_LAST_MESSAGE_SUCCESS', {directId, messageId, nextCursor});
export const getChatLastMessageFail = (directId: string) =>
  action('GET_CHAT_LAST_MESSAGE_FAIL', {directId});

export const setUserTyping = (userId: string, chatId: string) =>
  action('SET_USER_TYPING', {userId, chatId});

export const setCurrentChat = (chatId: string) => action('SET_CURRENT_CHAT', {chatId});

export const setCurrentThread = (threadId: string) => action('SET_CURRENT_THREAD', {threadId});
