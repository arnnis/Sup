import {PendingMessage, User} from '../../../models';
import getUser from './slack-user-to-gifted-user';

export default (pendingMessage: PendingMessage, me: User) => ({
  _id: pendingMessage.id,
  text: pendingMessage.text,
  createdAt: Number(new Date()),
  user: getUser(me),

  pending: true,
});
