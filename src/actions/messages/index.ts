import {action} from 'typesafe-actions';
import {Message, PendingMessage} from '../../models';

export const getMessagesStart = (chatId: string) => action('GET_MESSAGES_START', {chatId});
export const getMessagesSuccess = (chatId: string, messages: Array<Message>, nextCursor: string) =>
  action('GET_MESSAGES_SUCCESS', {chatId, messages, nextCursor});
export const getMessagesFail = (chatId: string) => action('GET_MESSAGES_FAIL', {chatId});

export const addMessageToChat = (messageId: string, chatId: string, threadId?: string) =>
  action('ADD_MESSAGE_TO_CHAT', {messageId, chatId, threadId});

export const addPendingMessage = (message: PendingMessage) =>
  action('ADD_PENDING_MESSAGE', {message});

export const removePendingMessage = (pendingId: number, chatId: string) =>
  action('REMOVE_PENDING_MESSAGE', {pendingId, chatId});
