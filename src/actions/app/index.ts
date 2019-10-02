import {action} from 'typesafe-actions';

export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected';

export const setConnectionStatus = (status: ConnectionStatus) =>
  action('SET_CONNECTION_STATUS', {status});

export const getCurrentUserStart = () => action('GET_CURRENT_USER_START');
export const getCurrentUserSuccess = () => action('GET_CURRENT_USER_SUCCESS');
export const getCurrentUserFail = () => action('GET_CURRENT_USER_FAIL');

export const setDrawerOpen = (drawerState: boolean) =>
  action('SET_DRAWER_OPEN', {drawerState});
