import {MessageInput} from '../../models';
import {store} from '../../App';
import {
  addPendingMessage,
  addMessageToChat,
  removePendingMessage,
} from '../../actions/messages';
import {socket} from '.';
import {batch} from 'react-redux';
import {storeEntities, updateEntity} from '../../actions/entities';
import {RootState} from '../../reducers';
import {getMember} from '../../actions/members/thunks';

export const sendMessage = (message: MessageInput) => {
  let id = Math.random() * 100000000000000000;
  message = {id, ...message};
  if (message.type === 'message') store.dispatch(addPendingMessage(message));
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

    store.dispatch(getMember(userId));

    // Increase chat unread count
    let state = store.getState() as RootState;
    let chat = state.entities.chats.byId[chatId];
    let isMe =
      userId ===
      state.teams.list.find(tm => tm.id === state.teams.currentTeam).userId;
    if (!isMe)
      store.dispatch(
        updateEntity('chats', chatId, {
          dm_count: chat && (chat['dm_count'] ? chat['dm_count'] + 1 : 1),
          unread_count:
            chat && (chat['unread_count'] ? chat['unread_count'] + 1 : 1),
        }),
      );
  });
};

export const handleSendMessageAckRecieved = data => {
  let state: RootState = store.getState();
  let pendingMessages = state.messages.pendingMessages;
  let currentTeam = state.teams.currentTeam;

  let userId = state.teams.list.find(ws => (ws.id = currentTeam)).userId;

  // Check this ack is for a pending message
  for (let chatId in pendingMessages) {
    for (let pendingMessage of pendingMessages[chatId]) {
      if (pendingMessage.id === data.reply_to) {
        pendingMessage = {
          ...pendingMessage,
          ts: data.ts,
        };

        batch(() => {
          store.dispatch(removePendingMessage(pendingMessage.id, chatId));
          delete pendingMessage['id'];
          store.dispatch(
            storeEntities('messages', [{...pendingMessage, user: userId}]),
          );
          store.dispatch(
            addMessageToChat(pendingMessage.ts, pendingMessage.channel),
          );
        });
      }
    }
  }
};
