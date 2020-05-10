import {setPresence} from './app-slice';
import {User} from '../models';
import http from '../utils/http';
import {batch} from 'react-redux';
import {storeEntities} from '../actions/entities';
import {RootState} from '../reducers';
import select from '../utils/select';
import {AppThunk} from '../store/configureStore';

export const getCurrentUser = (): AppThunk => async (dispatch, getState) => {
  try {
    let store: RootState = getState();
    let currentUser = store.teams.list.find((ws) => ws.id === store.teams.currentTeam)?.userId;

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
    console.log(err);
  }
};

export const togglePresence = (): AppThunk => async (dispatch, getState) => {
  let state: RootState = getState();
  let currentPresence = state.app.presence;
  let nextPresence = select(currentPresence, {
    away: 'auto',
    auto: 'away',
  });
  try {
    let {ok}: {ok: boolean} = await http({
      path: '/users.setPresence',
      body: {
        presence: nextPresence,
      },
      isFormData: true,
      silent: false,
    });

    if (ok) {
      dispatch(setPresence(nextPresence));
    }

    return ok;
  } catch (err) {
    console.log(err);
    return err;
  }
};
