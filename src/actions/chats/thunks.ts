import {batch} from 'react-redux';
import http from '../../utils/http';
import {Chat, Message, PaginationResult} from '../../models';
import {storeEntities} from '../entities';
import {
  fetchChatsStart,
  fetchChatsSuccess,
  getChatLastMessageStart,
  getChatLastMessageSuccess,
  getChatLastMessageFail,
  fetchChatsFail,
} from '.';
import {RootState} from '../../reducers';
import imsDirects from '../../utils/filterIms';
import {getMember} from '../members/thunks';

export const getChats = () => async (dispatch, getState) => {
  let store: RootState = getState();
  let cursor = store.chats.nextCursor;
  if (cursor === 'end') return;

  try {
    dispatch(fetchChatsStart());
    let {
      ims,
      channels,
      groups,
      response_metadata,
    }: {
      ims: Array<Chat>;
      channels: Array<Chat>;
      groups: Array<Chat>;
    } & PaginationResult = await http({
      path: '/users.counts',
      body: {
        include_message: 1,
        //mpim_aware: 1,
        // simple_unreads: 1,
      },
      isFormData: true,
    });

    let nextCursor = response_metadata ? response_metadata.next_cursor : 'end';

    ims = ims.filter(imsDirects);

    batch(() => {
      dispatch(storeEntities('chats', [...ims, ...channels, ...groups]));
      dispatch(fetchChatsSuccess(ims, [...channels, ...groups], nextCursor));
    });

    return [...ims, ...channels, ...groups];
  } catch (err) {
    dispatch(fetchChatsFail());
    console.log(err);
  }
};

export const getChatLastMessage = (chatId: string) => async (
  dispatch,
  getState,
) => {
  let store: RootState = getState();

  // If already is loading or already loaded break.
  let loading =
    store.chats.lastMessages[chatId] &&
    store.chats.lastMessages[chatId].loading;
  let loaded =
    store.chats.lastMessages[chatId] &&
    store.chats.lastMessages[chatId].messageId;
  if (loading || loaded) return;

  try {
    dispatch(getChatLastMessageStart(chatId));
    let {
      messages,
      response_metadata,
    }: {messages: Array<Message>} & PaginationResult = await http({
      path: '/conversations.history',
      body: {
        channel: chatId,
        limit: 1,
      },
      isFormData: true,
    });

    let next_cursor = response_metadata ? response_metadata.next_cursor : 'end';

    if (!messages.length) throw 'no lst message';

    batch(() => {
      dispatch(storeEntities('messages', messages));
      dispatch(getChatLastMessageSuccess(chatId, messages[0].ts, next_cursor));
    });
  } catch (err) {
    dispatch(getChatLastMessageFail(chatId));
  }
};

export const openChat = (userIds: Array<string>) => async dispatch => {
  let {channel}: {channel: any} = await http({
    path: '/conversations.open',
    body: {
      users: userIds.join(','),
      return_im: true,
    },
  });

  // Chat object form users.counts is diffrent so we adapt to it.
  dispatch(
    storeEntities('chats', [
      {
        dm_count: channel.unread_count,
        id: channel.id,
        is_ext_shared: channel.is_org_shared,
        is_im: channel.is_im,
        is_open: channel.is_open,
        user_id: channel.user,
      } as Chat,
    ]),
  );

  return channel.id;
};

export const markChatAsRead = (
  chatId: string,
  messageId: string,
) => async dispatch => {
  try {
    let {ok} = await http({
      path: '/conversations.mark',
      body: {
        channel: chatId,
        ts: messageId,
      },
    });
    return ok;
  } catch (err) {
    console.log(err);
  }
};
