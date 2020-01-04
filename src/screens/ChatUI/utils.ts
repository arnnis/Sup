import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import {Message, Chat} from '../../models';
import {ChatType} from '.';

dayjs.extend(utc);

export function isSameUser(currentMessage: Message, diffMessage: Message | null | undefined) {
  return !!(diffMessage && diffMessage.user === currentMessage.user);
}

export function isSameDay(currentMessage: Message, diffMessage: Message | null | undefined) {
  if (!diffMessage || !diffMessage.ts) {
    return false;
  }

  const currentCreatedAt = dayjs.unix(Number(currentMessage.ts.split('.')[0])).local();
  const diffCreatedAt = dayjs.unix(Number(diffMessage.ts.split('.')[0])).local();

  if (!currentCreatedAt.isValid() || !diffCreatedAt.isValid()) {
    return false;
  }

  return currentCreatedAt.isSame(diffCreatedAt, 'day');
}

export function getChatType(chat: Chat): ChatType {
  return chat?.is_im ? 'direct' : 'channel';
}
