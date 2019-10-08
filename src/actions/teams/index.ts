import {action} from 'typesafe-actions';
import {User, Team} from '../../models';

export const signinTeamStart = () => action('SIGNIN_TEAM_START');
export const signinTeamSuccess = (token: string, teamId: string, userId: string) =>
  action('SIGNIN_TEAM_SUCCESS', {token, teamId, userId});
export const signinTeamFail = () => action('SIGNIN_TEAM_FAIL');

export const initTeamStart = () => action('INIT_TEAM_START');
export const initTeamSuccess = () => action('INIT_TEAM_SUCCESS');
export const initTeamFail = () => action('INIT_TEAM_FAIL');

export const getTeamStart = (teamId: string) => action('GET_TEAM_START', {teamId});
export const getTeamSuccess = (teamId: string) => action('GET_TEAM_SUCCESS', {teamId});
export const getTeamFail = (teamId: string) => action('GET_TEAM_FAIL', {teamId}, {teamId});

export const setCurrentTeam = (teamId: string) => action('SET_CURRENT_TEAM', {teamId});

export const getEmojisStart = () => action('GET_EMOJIS_START');
export const getEmojisSuccess = () => action('GET_EMOJIS_SUCCESS');
export const getEmojisFail = () => action('GET_EMOJIS_FAIL');

export const logout = (teamId: string) => action('LOGOUT', {teamId});
