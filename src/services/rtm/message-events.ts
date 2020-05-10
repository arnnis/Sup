import {SendInput, PendingMessage, PingMessage} from '../../models';
import {store} from '../../App';
import {
  addPendingMessage,
  addMessageToChat,
  removePendingMessage,
  removeMessageFromChat,
} from '../../slices/messages-slice';
import {send} from '.';
import {batch} from 'react-redux';
import {storeEntities, updateEntity} from '../../actions/entities';
import {RootState} from '../../reducers';
import {getMember} from '../../actions/members/thunks';
import dayjs from 'dayjs';
import {
  ReactionAddedEvent,
  MessageEvent,
  MessageReplyEvent,
  NotificationEvent,
  MessageDeletedEvent,
  MessageChangedEvent,
} from './types';
import {meSelector} from '../../reducers/teams';
import {goToChat} from '../../slices/chats-thunks';
import {addReaction, removeReaction} from '../../slices/messages-thunks';
import {Platform} from '../../utils/platform';

export const sendMessage = (input: SendInput) => {
  let fingerprint = Math.random() * 100000000000000000;

  if (input.type === 'message') {
    let meId = meSelector(store.getState() as RootState).id;
    let pendingMessage: PendingMessage = {
      id: fingerprint,
      type: 'message',
      text: input.text,
      channel: input.channel,
      thread_ts: input.thread_ts,
      user: meId,
      ts: dayjs().unix().toString() + '.0000',
      pending: true,
    };
    store.dispatch(storeEntities('messages', [pendingMessage]));
    store.dispatch(addPendingMessage({message: pendingMessage}));

    send(pendingMessage);
    return true;
  }

  if (input.type === 'ping') {
    let pingMessage: PingMessage = {
      id: fingerprint,
      type: 'ping',
    };
    send(pingMessage);
    return true;
  }

  return false;
};

export const handleMessageRecieved = (data: MessageEvent) => {
  let messageId = data.ts;
  let chatId = data.channel;
  let userId = data.user;
  let threadId = data.thread_ts;
  batch(() => {
    store.dispatch(storeEntities('messages', [data]));

    // Add to chat's messages list
    store.dispatch(addMessageToChat({messageId, chatId, threadId}));

    store.dispatch(getMember(userId) as any);

    // Increase chat unread count
    let state = store.getState() as RootState;
    let chat = state.entities.chats.byId[chatId];
    let isMe = userId === state.teams.list.find((tm) => tm.id === state.teams.currentTeam)?.userId;
    if (!isMe)
      store.dispatch(
        updateEntity('chats', chatId, {
          dm_count: chat && (chat['dm_count'] ? chat['dm_count'] + 1 : 1),
          unread_count: chat && (chat['unread_count'] ? chat['unread_count'] + 1 : 1),
        }),
      );
  });
};

export const handleSendMessageAckRecieved = (data) => {
  let state: RootState = store.getState();
  let messageLists = state.messages.list;
  let currentTeam = state.teams.currentTeam;

  let meId = state.teams.list.find((ws) => ws.id === currentTeam)?.userId;

  // Check this ack is for a pending message
  for (let chatId in messageLists) {
    let index = messageLists[chatId].indexOf(data.reply_to);
    if (index > -1) {
      let pendingId = messageLists[chatId][index] as number;
      let pendingMessage = state.entities.messages.byId[pendingId];
      batch(() => {
        store.dispatch(removePendingMessage({pendingId, chatId}));
        store.dispatch(storeEntities('messages', [{...data, user: meId}]));
        store.dispatch(
          addMessageToChat({messageId: data.ts, chatId, threadId: pendingMessage.thread_ts}),
        );
      });
    }
  }
};

export const handleNotificationRecieved = (data: NotificationEvent) => {
  const state: RootState = store.getState();

  if (Platform.isWeb) {
    // No notifcation when app is visible and notif is from current open chat
    if (document.visibilityState === 'visible' && state.chats.currentChatId === data.channel)
      return;

    // Issue a notification
    let notif = new Notification(data.title, {
      body: data.content,
    });

    notif.onclick = () => {
      store.dispatch(goToChat(data.channel) as any);
    };
  }
};

export const handleReactionAdded = (data: ReactionAddedEvent) => {
  store.dispatch(addReaction(data.reaction, data.user, data.item.ts) as any);
};

export const handleReactionRemoved = (data: ReactionAddedEvent) => {
  store.dispatch(removeReaction(data.reaction, data.user, data.item.ts) as any);
};

export const handleReplyAdded = (data: MessageReplyEvent) => {
  const {message} = data;
  store.dispatch(updateEntity('messages', message.thread_ts, message));
};

export const handleMessageDeleted = (data: MessageDeletedEvent) => {
  const chatId = data.channel;
  const threadId = data.previous_message.thread_ts;
  const messageId = data.previous_message.ts;
  store.dispatch(removeMessageFromChat({messageId, chatId: threadId || chatId}));
};

export const handleMessageChanged = (data: MessageChangedEvent) => {
  const {previous_message: message} = data;
  store.dispatch(updateEntity('messages', message.ts, message));
};
