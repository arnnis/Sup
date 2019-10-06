import moment from 'moment';
import {Message} from '../../models';

export function isSameUser(
  currentMessage: Message,
  diffMessage: Message | null | undefined,
) {
  return !!(diffMessage && diffMessage.user === currentMessage.user);
}
