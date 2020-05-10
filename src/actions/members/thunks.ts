import {
  getMembersStart,
  getMembersSuccess,
  getMembersFail,
  getMemberStart,
  getMemberFail,
  getMemberSuccess,
} from '.';
import {storeEntities} from '../entities';
import http from '../../utils/http';
import {batch} from 'react-redux';
import {User} from '../../models';
import filterMembers from '../../utils/filterMembers';
import {RootState} from '../../reducers';
import {queryPresences, subscribePresence} from '../../services/rtm/members-events';
import {NavigationInjectedProps} from 'react-navigation';
import isLandscape from '../../utils/stylesheet/isLandscape';
import {openBottomSheet} from '../../slices/app-slice';

export const getMembers = () => async (dispatch, getState) => {
  let state: RootState = getState();

  dispatch(getMembersStart());

  try {
    let {members}: {members: User[]} = await http({
      path: '/users.list',
      body: {
        limit: 500,
        presence: true,
      },
      isFormData: true,
    });

    members = members.filter(filterMembers);

    batch(() => {
      dispatch(storeEntities('users', members));
      dispatch(getMembersSuccess(members));
    });

    // Fetch direct list member data just in case.
    state.chats.directsList.forEach((directId) => {
      let chat = state.entities.chats.byId[directId];
      chat.user_id && dispatch(getMember(chat.user_id));
    });

    queryPresences(members.map((member) => member.id));
    subscribePresence(members.map((member) => member.id));

    return members;
  } catch (err) {
    console.log(err);
    dispatch(getMembersFail());
    throw err;
  }
};

export const getMembersByUserIds = (userIds: Array<string>) => async (dispatch, getState) => {
  let state: RootState = getState();

  userIds.forEach(async (userId) => {
    let loading = state.members.loading[userId];
    let alreadyLoaded = !!state.entities.users.byId[userId];
    if (loading || alreadyLoaded) return;

    let {user}: {user: User} = await http({
      path: '/users.info',
      body: {
        user: userId,
      },
      silent: true,
    });

    dispatch(storeEntities('users', [user]));
  });
  return true;
};

export const getMember = (userId: string) => async (dispatch, getState) => {
  let state: RootState = getState();

  let loading = state.members.loading[userId];
  let alreadyLoaded = state.entities.users.byId[userId];
  let loadingList = state.members.loadingList;
  if (loading || alreadyLoaded || loadingList) return;

  dispatch(getMemberStart(userId));

  try {
    let {user}: {user: User} = await http({
      path: '/users.info',
      body: {
        user: userId,
        presence: 1,
      },
      silent: true,
    });

    queryPresences([userId]);
    subscribePresence([userId]);

    batch(() => {
      dispatch(storeEntities('users', [user]));
      dispatch(getMemberSuccess(userId));
    });
  } catch (err) {
    console.log(err);
    dispatch(getMemberFail(userId));
  }
};

export const goToUserProfile = (
  userId: string,
  navigation?: NavigationInjectedProps['navigation'],
) => (dispatch) => {
  const params = {
    userId,
  };
  if (!isLandscape()) navigation.push('UserProfile', params);
  else dispatch(openBottomSheet({screen: 'UserProfile', params}));
};
