import {action} from 'typesafe-actions';
import {Chat} from '../../models';

export const getGroupsStart = () => action('GET_GROUPS_START');
export const getGroupsSuccess = (groups: Chat) =>
  action('GET_GROUPS_SUCCESS', {groups});
export const getGroupsFail = () => action('GET_GROUPS_FAIL');
