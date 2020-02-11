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
  getChatInfoStart,
  getChatInfoSuccess,
  getChatInfoFail,
  getChannelMembersStart,
  getChannelMembersFail,
  getChannelMembersSuccess,
  setUserTyping,
  unsetUserTyping,
  setCurrentThread,
  setCurrentChat,
} from '.';
import {RootState} from '../../reducers';
import imsDirects from '../../utils/filterIms';
import isLandscape from '../../utils/stylesheet/isLandscape';
import {openBottomSheet} from '../app';
import {NavigationInjectedProps} from 'react-navigation';
import getCurrentOrientaion from '../../utils/stylesheet/getCurrentOrientaion';
import {NavigationService} from '../../navigation/Navigator';

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
        //simple_unreads: 1,
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

export const getChatLastMessage = (chatId: string) => async (dispatch, getState) => {
  let store: RootState = getState();

  // If already is loading or already loaded break.
  let loading = store.chats.lastMessages[chatId] && store.chats.lastMessages[chatId].loading;
  let loaded = store.chats.lastMessages[chatId] && store.chats.lastMessages[chatId].messageId;
  if (loading || loaded) return;

  try {
    dispatch(getChatLastMessageStart(chatId));
    let {messages, response_metadata}: {messages: Array<Message>} & PaginationResult = await http({
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

export const markChatAsRead = (chatId: string, messageId: string) => async dispatch => {
  try {
    let {ok} = await http({
      path: '/conversations.mark',
      body: {
        channel: chatId,
        ts: messageId,
      },
    });
    return Promise.resolve(ok);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

export const getChatInfo = (chatId: string) => async (dispatch, getState) => {
  let state: RootState = getState();
  let alreadyLoaded = state.chats.fullLoad[chatId]?.loaded ?? false;
  let loading = state.chats.fullLoad[chatId]?.loading ?? false;
  if (alreadyLoaded || loading) return;
  dispatch(getChatInfoStart(chatId));
  try {
    let {channel}: {channel: Chat} = await http({
      path: '/conversations.info',
      body: {
        channel: chatId,
        include_num_members: true,
      },
    });

    batch(() => {
      dispatch(storeEntities('chats', [channel]));
      dispatch(getChatInfoSuccess(chatId, channel));
    });

    return Promise.resolve(channel);
  } catch (err) {
    console.log(err);
    dispatch(getChatInfoFail(chatId));
    return Promise.reject(err);
  }
};

export const getChannelMembers = (chatId: string) => async (dispatch, getState) => {
  let state: RootState = getState();
  let loadStatus = state.chats.membersListLoadStatus[chatId];
  if (loadStatus?.loading || loadStatus?.nextCursor === 'end') return;
  dispatch(getChannelMembersStart(chatId));
  try {
    let {members, response_metadata}: {members: Array<string>} & PaginationResult = await http({
      path: '/conversations.members',
      body: {
        channel: chatId,
        include_num_members: true,
        limit: 100,
        cursor: loadStatus?.nextCursor ?? '',
      },
    });

    let next_cursor =
      response_metadata && response_metadata.next_cursor ? response_metadata.next_cursor : 'end';

    batch(() => {
      dispatch(getChannelMembersSuccess(chatId, members, next_cursor));
    });

    return Promise.resolve(members);
  } catch (err) {
    console.log(err);
    dispatch(getChannelMembersFail(chatId));
    return Promise.reject(err);
  }
};

export const setTyping = (userId: string, chatId: string) => (dispatch, getState) => {
  let state = getState() as RootState;
  if (state.chats.typingsUsers[chatId]?.includes(userId)) return;
  dispatch(setUserTyping(userId, chatId));
  setTimeout(() => {
    dispatch(unsetUserTyping(userId, chatId));
  }, 5000);
};

export const goToChat = (
  chatId,
  navigation?: NavigationInjectedProps['navigation'] | undefined,
) => (dispatch, getState) => {
  dispatch(setCurrentChat(chatId));
  if (getCurrentOrientaion() === 'portrait')
    (navigation || NavigationService).navigate('ChatUI', {chatId: chatId});
};

export const goToThread = (threadId, navigation: NavigationInjectedProps['navigation']) => (
  dispatch,
  getState,
) => {
  dispatch(setCurrentThread(threadId));
  const state: RootState = getState();
  let params = {
    chatType: 'thread',
    threadId,
    chatId: state.chats.currentChatId,
  };

  if (isLandscape()) dispatch(openBottomSheet('ChatUI', params));
  else navigation.push('ChatUI', params);
};

export const goToChannelDetails = (chatId: string) => dispatch => {
  const params = {
    chatId,
  };

  if (isLandscape()) dispatch(openBottomSheet('ChannelDetails', params));
  else NavigationService.navigate('ChannelDetails', params);
};
