import {action} from 'typesafe-actions';
import {MessageAttachement} from '../../models';

export const getFilesStart = () => action('GET_FILES_START');
export const getFilesSuccess = (files: MessageAttachement[]) =>
  action('GET_FILES_SUCCESS', {files});
export const getFilesFail = () => action('GET_FILES_FAIL');
