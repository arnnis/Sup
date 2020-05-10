import {action} from 'typesafe-actions';
import {MessageAttachement} from '../models';

export const getFilesStart = () => action('GET_FILES_START');
export const getFilesSuccess = (files: MessageAttachement[]) =>
  action('GET_FILES_SUCCESS', {files});
export const getFilesFail = () => action('GET_FILES_FAIL');

export const openUploadDialog = (params: any) => action('OPEN_UPLOAD_DIALOG', {params});
export const closeUploadDialog = () => action('CLOSE_UPLOAD_DIALOG');
