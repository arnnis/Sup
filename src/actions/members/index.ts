import {action} from 'typesafe-actions';
import {User} from '../../models';

export const getMembersStart = () => action('GET_ALL_MEMBERS_START');
export const getMembersSuccess = (members: Array<User>) =>
  action('GET_ALL_MEMBERS_SUCCESS', {members});
export const getMembersFail = () => action('GET_ALL_MEMBERS_FAIL');

export const getMemberStart = (userId: string) => action('GET_MEMBER_START', {userId});
export const getMemberSuccess = (userId: string) => action('GET_MEMBER_SUCCESS', {userId});
export const getMemberFail = (userId: string) => action('GET_MEMBER_FAIL', {userId});
