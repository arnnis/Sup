import {
  getMembersStart,
  getMembersSuccess,
  getMembersFail,
  getMemberStart,
  getMemberFail,
  getMemberSuccess,
} from './members-slice';
import {storeEntities} from './entities-slice';
import http from '../utils/http';
import {batch} from 'react-redux';
import {User} from '../models';
import filterMembers from '../utils/filterMembers';
import {queryPresences, subscribePresence} from '../services/rtm/members-events';
import {NavigationInjectedProps} from 'react-navigation';
import isLandscape from '../utils/stylesheet/isLandscape';
import {openBottomSheet} from './app-slice';
import {AppThunk} from '../store/configureStore';

export const getMembers = (): AppThunk => async (dispatch, getState) => {
  let state = getState();

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
      dispatch(storeEntities({entity: 'users', data: members}));
      dispatch(getMembersSuccess({members}));
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

export const getMember = (userId: string): AppThunk => async (dispatch, getState) => {
  let state = getState();

  let loading = state.members.loading[userId];
  let alreadyLoaded = state.entities.users.byId[userId];
  let loadingList = state.members.loadingList;
  if (loading || alreadyLoaded || loadingList) return;

  dispatch(getMemberStart({userId}));

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
      dispatch(storeEntities({entity: 'users', data: [user]}));
      dispatch(getMemberSuccess({userId}));
    });
  } catch (err) {
    console.log(err);
    dispatch(getMemberFail({userId}));
  }
};

export const goToUserProfile = (
  userId: string,
  navigation?: NavigationInjectedProps['navigation'],
): AppThunk => (dispatch) => {
  const params = {
    userId,
  };
  // @ts-ignore
  if (!isLandscape()) navigation?.push('UserProfile', params);
  else dispatch(openBottomSheet({screen: 'UserProfile', params}));
};
