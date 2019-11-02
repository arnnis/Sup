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

export const getChatInfoStart = (chatId: string) => action('GET_CHAT_INFO_START', {chatId});
export const getChatInfoSuccess = (chatId: string, chat: Chat) =>
  action('GET_CHAT_INFO_SUCCESS', {chatId});
export const getChatInfoFail = (chatId: string) => action('GET_CHAT_INFO_FAIL', {chatId});

export const getChannelMembersStart = (chatId: string) =>
  action('GET_CHANNEL_MEMBERS_START', {chatId});
export const getChannelMembersSuccess = (chatId: string, members: Array<string>) =>
  action('GET_CHANNEL_MEMBERS_SUCCESS', {chatId, members});
export const getChannelMembersFail = (chatId: string) =>
  action('GET_CHANNEL_MEMBERS_FAIL', {chatId});
