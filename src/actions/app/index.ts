import {action} from 'typesafe-actions';
import {AppState} from '../../reducers/app';
import {Presence} from '../../models';

export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected';

export const setConnectionStatus = (status: ConnectionStatus) =>
  action('SET_CONNECTION_STATUS', {status});

export const getCurrentUserStart = () => action('GET_CURRENT_USER_START');
export const getCurrentUserSuccess = () => action('GET_CURRENT_USER_SUCCESS');
export const getCurrentUserFail = () => action('GET_CURRENT_USER_FAIL');

export const setDrawerOpen = (drawerState: boolean) => action('SET_DRAWER_OPEN', {drawerState});

export const openBottomSheet = (screen: string, params: any) =>
  action('OPEN_BOTTOM_SHEET', {screen, params});

export const closeBottomSheet = () => action('CLOSE_BOTTOM_SHEET');

export const toggleToast = (toast: AppState['toast']) => action('TOGGLE_TOAST', {toast});

export const setPresence = (presence: Presence) => action('SET_PRESENCE', {presence});
