import http from '../../utils/http';
import {store} from '../../App';
import {batch} from 'react-redux';
import {setConnectionStatus} from '../../actions/app';
import {getCurrentUser} from '../../actions/app/thunks';
import {getChats} from '../../actions/chats/thunks';
import {
  sendMessage,
  handleMessageRecieved,
  handleSendMessageAckRecieved,
  handleReactionAdded,
  handleReactionRemoved,
  handleReplyAdded,
} from './message-events';
import {handleUserTyping, handleChatsMarkedAsSeen} from './chat-events';
import {handleUserPresenceChange} from './members-events';

export let socket: WebSocket = null;
export let connected = false;
let pingInterval;
let lastPingId;
let reconnectInterval;
let isReconnect = false;

export const init = async () => {
  let {url}: {url: string} = await http({
    path: '/rtm.connect',
    method: 'POST',
  });

  socket = new WebSocket(url);

  socket.onopen = e => {
    console.log('[open] Connection established');
    connected = true;
    store.dispatch(setConnectionStatus('connected'));

    startPing();
    stopReconnect();
  };

  socket.onmessage = ({data}) => {
    data = JSON.parse(data);

    if (data.type === 'hello') {
      if (isReconnect)
        batch(() => {
          store.dispatch(getCurrentUser() as any);
          store.dispatch(getChats() as any);
        });
    }

    if (data.type === 'pong') {
      // reset for next ping when last ping was responded by server
      if (lastPingId === data.reply_to) {
        lastPingId = null;
      }

      return;
    }

    console.log(`[message] Data received from server:`, data);

    if (data.type === 'message') {
      // Ingoring hidden message events. here we only add thread and chat regular messages.
      if (!data.hidden) handleMessageRecieved(data);
    }

    if (data.type === 'message' && data.subtype === 'message_replied') handleReplyAdded(data);

    if (data.type === 'user_typing') handleUserTyping(data);

    if (data.type === 'reaction_added') handleReactionAdded(data);

    if (data.type === 'reaction_removed') handleReactionRemoved(data);

    // Chat was seen by current user.
    if (data.type === 'im_marked' || data.type === 'channel_marked' || data.type === 'group_marked')
      handleChatsMarkedAsSeen(data);

    if (data.type === 'presence_change') handleUserPresenceChange(data);

    // Handle server ack messages
    if (data.reply_to) {
      handleSendMessageAckRecieved(data);
    }
  };

  socket.onclose = event => {
    if (event.wasClean) {
      console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
    } else {
      // e.g. server process killed or network down
      // event.code is usually 1006 in this case
      console.log('[close] Connection died');
    }
    store.dispatch(setConnectionStatus('disconnected'));
    connected = false;

    !__DEV__ && reconnect();
  };

  socket.onerror = error => {
    alert(`[error] ${error.message}`);
  };
};

export const closeSocket = () => {
  if (socket) {
    stopPing();
    stopReconnect();
    socket.close();
  }
};

const startPing = () => {
  pingInterval = setInterval(() => {
    // If last ping did not get a response. close the socket.
    if (lastPingId) {
      closeSocket();
      return;
    }
    let message = sendMessage({type: 'ping'});
    lastPingId = message && message.id;
    // console.log('[socket] ping sent');
  }, 10000);
};

const stopPing = () => {
  pingInterval && clearInterval(pingInterval);
  pingInterval = null;
};

const reconnect = () => {
  reconnectInterval = setInterval(() => {
    console.log('[socket] reconnecting...');
    init();
    isReconnect = true;
  }, 5000);
};

const stopReconnect = () => {
  reconnectInterval && clearInterval(reconnectInterval);
  reconnectInterval = null;
};

export * from './message-events';
export * from './chat-events';
