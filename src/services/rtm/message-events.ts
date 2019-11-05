import {MessageInput} from '../../models';
import {store} from '../../App';
import {addPendingMessage, addMessageToChat, removePendingMessage} from '../../actions/messages';
import {socket} from '.';
import {batch} from 'react-redux';
import {storeEntities, updateEntity} from '../../actions/entities';
import {RootState} from '../../reducers';
import {getMember} from '../../actions/members/thunks';
import dayjs from 'dayjs';

export const sendMessage = (message: MessageInput) => {
  let fingerprint = Math.random() * 100000000000000000;
  message = {id: fingerprint, ...message};
  if (message.type === 'message') {
    let state: RootState = store.getState();
    let currentTeam = state.teams.currentTeam;
    let meId = state.teams.list.find(ws => (ws.id === currentTeam)).userId;
    let pendingMessage = {
      ...message,
      user: meId,
      ts:
        dayjs()
          .unix()
          .toString() + '.0000',
      pending: true,
    };
    store.dispatch(storeEntities('messages', [pendingMessage]));
    store.dispatch(addPendingMessage(pendingMessage));
  }
  socket && socket.send(JSON.stringify(message));
  return message;
};

export const handleMessageRecieved = data => {
  let messageId = data.ts;
  let chatId = data.channel;
  let userId = data.user;
  batch(() => {
    store.dispatch(storeEntities('messages', [data]));

    // Add to chat's messages list
    store.dispatch(addMessageToChat(messageId, chatId));

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

  let meId = state.teams.list.find(ws => (ws.id === currentTeam)).userId;

  // Check this ack is for a pending message
  for (let chatId in messageLists) {
    let index = messageLists[chatId].indexOf(data.reply_to);
    if (index > -1) {
      let pendingId = messageLists[chatId][index] as number;
      batch(() => {
        store.dispatch(removePendingMessage(pendingId, chatId));
        store.dispatch(storeEntities('messages', [{...data, user: meId}]));
        store.dispatch(addMessageToChat(data.ts, chatId));
      });
    }
  }
};
