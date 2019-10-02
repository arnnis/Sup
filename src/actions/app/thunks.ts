import {
  getCurrentUserSuccess,
  getCurrentUserFail,
  getCurrentUserStart,
} from '.';
import {Chat, User} from '../../models';
import http from '../../utils/http';
import {batch} from 'react-redux';
import {storeEntities} from '../entities';
import {RootState} from '../../reducers';

export const getCurrentUser = () => async (dispatch, getState) => {
  try {
    let store: RootState = getState();
    let currentUser = store.teams.list.find(
      ws => ws.id === store.teams.currentTeam,
    ).userId;

    dispatch(getCurrentUserStart());
    let {user}: {user: User} = await http({
      path: '/users.info',
      body: {
        user: currentUser,
        //include_count: true,
      },
      isFormData: true,
    });

    batch(() => {
      dispatch(storeEntities('users', [user]));
    });
  } catch (err) {
    dispatch(getCurrentUserFail());
    console.log(err);
  }
};
