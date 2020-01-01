import {SendInput, PendingMessage, PingMessage} from '../../models';
import {store} from '../../App';
import {addPendingMessage, addMessageToChat, removePendingMessage} from '../../actions/messages';
import {socket} from '.';
import {batch} from 'react-redux';
import {storeEntities, updateEntity} from '../../actions/entities';
import {RootState} from '../../reducers';
import {getMember} from '../../actions/members/thunks';
import dayjs from 'dayjs';
import {ReactionAddedEvent, MessageEvent, MessageReplyEvent, NotificationEvent} from './types';
import {meSelector} from '../../reducers/teams';
import {goToChat} from '../../actions/chats/thunks';

export const sendMessage = (input: SendInput) => {
  let fingerprint = Math.random() * 100000000000000000;

  if (input.type === 'message') {
    let state: RootState = store.getState();
    let meId = meSelector(state).id;
    let pendingMessage: PendingMessage = {
      id: fingerprint,
      type: 'message',
      text: input.text,
      channel: input.channel,
      thread_ts: input.thread_ts,
      user: meId,
      ts:
        dayjs()
          .unix()
          .toString() + '.0000',
      pending: true,
    };
    store.dispatch(storeEntities('messages', [pendingMessage]));
    store.dispatch(addPendingMessage(pendingMessage));

    socket && socket.send(JSON.stringify(pendingMessage));
  }

  if (input.type === 'ping') {
    let pingMessage: PingMessage = {
      id: fingerprint,
      type: 'ping',
    };
    socket && socket.send(JSON.stringify(pingMessage));
  }

  return true;
};

export const handleMessageRecieved = (data: MessageEvent) => {
  let messageId = data.ts;
  let chatId = data.channel;
  let userId = data.user;
  let threadId = data.thread_ts;
  batch(() => {
    store.dispatch(storeEntities('messages', [data]));

    // Add to chat's messages list
    store.dispatch(addMessageToChat(messageId, chatId, threadId));

    store.dispatch(getMember(userId) as any);

    // Increase chat unread count
    let state = store.getState() as RootState;
    let chat = state.entities.chats.byId[chatId];
    let isMe = userId === state.teams.list.find(tm => tm.id === state.teams.currentTeam)?.userId;
    if (!isMe)
      store.dispatch(
        updateEntity('chats', chatId, {
          dm_count: chat && (chat['dm_count'] ? chat['dm_count'] + 1 : 1),
          unread_count: chat && (chat['unread_count'] ? chat['unread_count'] + 1 : 1),
        }),
      );
  });
};

export const handleSendMessageAckRecieved = data => {
  let state: RootState = store.getState();
  let messageLists = state.messages.list;
  let currentTeam = state.teams.currentTeam;

  let meId = state.teams.list.find(ws => ws.id === currentTeam).userId;

  // Check this ack is for a pending message
  for (let chatId in messageLists) {
    let index = messageLists[chatId].indexOf(data.reply_to);
    if (index > -1) {
      let pendingId = messageLists[chatId][index] as number;
      let pendingMessage = state.entities.messages.byId[pendingId];
      batch(() => {
        store.dispatch(removePendingMessage(pendingId, chatId));
        store.dispatch(storeEntities('messages', [{...data, user: meId}]));
        store.dispatch(addMessageToChat(data.ts, chatId, pendingMessage.thread_ts));
      });
    }
  }
};

export const handleNotificationRecieved = (data: NotificationEvent) => {
  let notif = new Notification(data.title, {
    body: data.content,
  });

  notif.onclick = () => {
    store.dispatch(goToChat(data.channel));
  };
};

export const handleReactionAdded = (data: ReactionAddedEvent) => {
  let {
    item: {ts: messageId},
  } = data;
  const state: RootState = store.getState() as any;
  let message = state.entities.messages.byId[messageId];

  // Message not loaded. so no need to update reaction
  if (!message) return;

  let reactions = message.reactions;

  // Reaction already exist. so only increase count
  if (reactions && reactions.some(reaction => reaction.name === data.reaction))
    store.dispatch(
      updateEntity('messages', messageId, {
        reactions: reactions.map(reaction =>
          reaction.name === data.reaction
            ? {
                ...reaction,
                count: reaction.count + 1,
              }
            : reaction,
        ),
      }),
    );
  else
    store.dispatch(
      updateEntity('messages', messageId, {
        reactions: [...(reactions || []), {name: data.reaction, users: [data.user], count: 1}],
      }),
    );
};

export const handleReactionRemoved = (data: ReactionAddedEvent) => {
  let {
    item: {ts: messageId},
  } = data;
  const state: RootState = store.getState() as any;
  let message = state.entities.messages.byId[messageId];

  // Message not loaded. so no need to update reaction
  if (!message) return;

  const reactions = message.reactions;

  const reaction = message.reactions?.find(reaction => reaction.name === data.reaction);

  // Check reaction exists
  if (!reaction) return;

  // Count is 1, so we should remove reaction object, otherwise decrease count by 1
  if (reaction.count === 1)
    store.dispatch(
      updateEntity('messages', messageId, {
        reactions: reactions.filter(reaction => reaction.name !== data.reaction),
      }),
    );
  else
    store.dispatch(
      updateEntity('messages', messageId, {
        reactions: reactions.map(reaction =>
          reaction.name === data.reaction ? {...reaction, count: reaction.count - 1} : reaction,
        ),
      }),
    );
};

export const handleReplyAdded = (data: MessageReplyEvent) => {
  const {message} = data;
  store.dispatch(updateEntity('messages', message.thread_ts, message));
};
