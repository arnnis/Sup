import {store} from '../../App';

import {setUserTyping} from '../../actions/chats';
import {updateEntity} from '../../actions/entities';

export const handleChatsMarkedAsSeen = data => {
  let chatId = data.channel;
  let dmCount = data.dm_count;
  let unreadCount = data.unread_count_display;
  store.dispatch(
    updateEntity('chats', chatId, {
      dm_count: dmCount,
      unread_count: unreadCount,
    }),
  );
};

export const handleUserTyping = data => {
  let userId = data.user;
  let chatId = data.channel;
  store.dispatch(setUserTyping(userId, chatId));
};
