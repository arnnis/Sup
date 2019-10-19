import {
  initTeamStart,
  initTeamSuccess,
  initTeamFail,
  signinTeamStart,
  signinTeamSuccess,
  signinTeamFail,
  getTeamStart,
  getTeamSuccess,
  getTeamFail,
  setCurrentTeam,
  getEmojisStart,
  getEmojisFail,
  logout,
} from '.';
import {batch} from 'react-redux';
import {storeEntities} from '../entities';
import http from '../../utils/http';
import {RootState} from '../../reducers';
import {NavigationService} from '../../navigation/Navigator';
import {getChats} from '../chats/thunks';
import {closeSocket, init as initRTM} from '../../services/rtm';
import {getCurrentUser} from '../app/thunks';
import {getMembers} from '../members/thunks';
import {SlackError} from '../../utils/errors';

export const signinTeam = (domain: string, email: string, password: string, pin?: string) => async (
  dispatch,
  getState,
) => {
  let state: RootState = getState();

  if (
    state.teams.list
      .map(tm => state.entities.teams.byId[tm.id])
      .some(team => team.domain === domain)
  ) {
    alert('You have already signed in this team.');
    return;
  }

  try {
    dispatch(signinTeamStart());

    let {team_id}: {team_id: string} = await http({
      path: '/auth.findTeam',
      body: {
        domain,
      },
      isFormData: true,
    });

    let {token, user, user_email}: {token: string; user: string; user_email: string} = await http({
      path: '/auth.signin',
      body: {
        email,
        password,
        team: team_id,
        pin,
      },
      isFormData: true,
    });

    dispatch(signinTeamSuccess(token, team_id, user));
    dispatch(switchTeam(team_id));
    NavigationService.navigate('Main');
    return Promise.resolve();
  } catch (err) {
    dispatch(signinTeamFail());
    if (err instanceof SlackError) {
      err.message === 'missing_pin' && alert('Please enter 2FA pin and try again');
      err.message === 'user_not_found' && alert('User with this email not found in this team');
      err.message === 'incorrect_password' && alert('Password is incorrect');
    }
    console.log(err);
  }
};

export const initTeam = () => async (dispatch, getState) => {
  let store: RootState = getState();
  let currentTeamId = store.teams.currentTeam;

  if (!currentTeamId) return;

  dispatch(initTeamStart());

  try {
    initRTM();

    batch(async () => {
      dispatch(getTeam(currentTeamId));
      dispatch(getCurrentUser());
      dispatch(getEmojis());
      await dispatch(getChats());
      dispatch(getMembers());
      dispatch(initTeamSuccess());
    });
  } catch (err) {
    console.log(err);
    dispatch(initTeamFail());
  }
};

export const getTeam = (teamId: string) => async dispatch => {
  dispatch(getTeamStart(teamId));

  try {
    let {team: team}: {team: any} = await http({
      path: '/team.info',
      body: {
        team: teamId,
      },
      isFormData: true,
    });

    batch(() => {
      dispatch(storeEntities('teams', [team]));
      dispatch(getTeamSuccess(teamId));
    });
  } catch (err) {
    console.log(err);
    dispatch(getTeamFail(teamId));
  }
};

export const switchTeam = (teamId: string) => dispatch => {
  closeSocket();
  batch(() => {
    dispatch(setCurrentTeam(teamId));
    dispatch(initTeam());
  });
};

export const logoutFromCurrentTeam = () => (dispatch, getState) => {
  let state: RootState = getState();
  let currentTeam = state.teams.currentTeam;
  dispatch(logout(currentTeam));
  closeSocket();
};

export const getEmojis = () => async dispatch => {
  try {
    dispatch(getEmojisStart());
    let {emoji}: {emoji: any} = await http({
      path: '/emoji.list',
      method: 'POST',
    });

    batch(() => {
      dispatch(storeEntities('emojis', emoji));
    });
  } catch (err) {
    dispatch(getEmojisFail());
    console.log(err);
  }
};
