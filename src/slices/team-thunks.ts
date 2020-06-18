import {
  signinTeamSuccess,
  getTeamStart,
  getTeamSuccess,
  getTeamFail,
  setCurrentTeam,
  logout,
} from './teams-slice';
import {batch} from 'react-redux';
import {storeEntities} from './entities-slice';
import http from '../utils/http';
import {NavigationService} from '../navigation/Navigator';
import {getChats} from './chats-thunks';
import {_closeSocket, init as initRTM} from '../services/rtm';
import {getCurrentUser} from './app-thunks';
import {getMembers} from './members-thunks';
import {SlackError} from '../utils/http/errors';
import {Alert} from 'react-native';
import {currentTeamSelector} from '../slices/teams-slice';
import isLandscape from '../utils/stylesheet/isLandscape';
import {closeBottomSheet, setDrawerOpen, openBottomSheet} from './app-slice';
import {Platform} from '../utils/platform';
import AlertWeb from '../utils/AlertWeb';
import {AppThunk} from '../store/configureStore';
import {Team} from '../models';

export const signinTeam = (
  domain: string,
  email: string,
  password: string,
  pin?: string,
): AppThunk => async (dispatch, getState) => {
  let state = getState();

  if (
    state.teams.list
      .map((tm) => state.entities.teams.byId[tm.id])
      .some((team) => team?.domain === domain)
  ) {
    alert('You have already signed into this team.');
    return;
  }

  try {
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

    dispatch(signinTeamSuccess({token, teamId: team_id, userId: user}));
    dispatch(switchTeam(team_id));

    dispatch(setDrawerOpen({drawerState: false}));
    if (isLandscape()) dispatch(closeBottomSheet());
    else NavigationService.navigate('Main');
    return Promise.resolve();
  } catch (err) {
    if (err instanceof SlackError) {
      err.message === 'team_not_found' && alert('Team not found');
      err.message === 'missing_pin' && alert('Please enter 2FA pin and try again');
      err.message === 'user_not_found' && alert('User with this email not found in this team');
      err.message === 'incorrect_password' && alert('Password is incorrect');
    }
    console.log(err);
  }
};

export const initTeam = (): AppThunk => async (dispatch, getState) => {
  let store = getState();
  let currentTeamId = store.teams.currentTeam;

  if (!currentTeamId) return;

  try {
    initRTM();

    batch(async () => {
      dispatch(getTeam(currentTeamId));
      dispatch(getCurrentUser());
      dispatch(getEmojis());
      await dispatch(getChats());
      dispatch(getMembers());
    });
  } catch (err) {
    console.log(err);
  }
};

export const getTeam = (teamId: string): AppThunk => async (dispatch) => {
  dispatch(getTeamStart({teamId}));

  try {
    let {team}: {team: Team} = await http({
      path: '/team.info',
      body: {
        team: teamId,
      },
      isFormData: true,
    });

    batch(() => {
      dispatch(storeEntities({entity: 'teams', data: [team]}));
      dispatch(getTeamSuccess({teamId}));
    });
  } catch (err) {
    console.log(err);
    dispatch(getTeamFail({teamId}));
  }
};

export const switchTeam = (teamId: string): AppThunk => (dispatch) => {
  _closeSocket();
  batch(() => {
    dispatch(setCurrentTeam({teamId}));
    dispatch(initTeam());
  });
};

export const logoutFromCurrentTeam = (): AppThunk => (dispatch, getState) => {
  let state = getState();
  const currentTeamName = currentTeamSelector(state)?.name;
  const _Alert = Platform.isNative ? Alert : AlertWeb();
  _Alert.alert(
    'Logout from ' + currentTeamName,
    'Do you want to logout?',
    [
      {
        text: 'Cancel',
      },
      {
        text: 'Logout',
        onPress: () => {
          let currentTeam = state.teams.currentTeam;
          _closeSocket();
          dispatch(logout({teamId: currentTeam}));
          dispatch(setCurrentTeam({teamId: ''}));
        },
      },
    ],
    {
      cancelable: true,
    },
  );
};

export const getEmojis = (): AppThunk => async (dispatch) => {
  try {
    let {emoji}: {emoji: any} = await http({
      path: '/emoji.list',
      method: 'POST',
    });

    batch(() => {
      dispatch(storeEntities({entity: 'emojis', data: emoji}));
    });
  } catch (err) {
    console.log(err);
  }
};

export const goToAddTeam = (): AppThunk => (dispatch) => {
  if (!isLandscape()) NavigationService.navigate('Auth');
  else dispatch(openBottomSheet({screen: 'Auth'}));
};

export const getTeams = (): AppThunk => async (dispatch, getState) => {
  const teamsList = getState().teams.list;
  const currentTeamId = getState().teams.currentTeam;
  batch(() => {
    teamsList.filter((t) => t.id !== currentTeamId).forEach((team) => dispatch(getTeam(team.id)));
  });
};
