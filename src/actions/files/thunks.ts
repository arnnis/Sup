import {getFilesStart, getFilesSuccess, getFilesFail} from '.';
import {RootState} from '../../reducers';
import http from '../../utils/http';
import {MessageAttachement} from '../../models';
import {batch} from 'react-redux';
import {storeEntities} from '../entities';

export const getFiles = (channel?: string, fileTypes?: string[], user?: string) => async (
  dispatch,
  getState,
) => {
  const state: RootState = getState();

  if (state.files.listLoading) return;

  dispatch(getFilesStart());

  const cursor = state.entities.files.byId[state.files.list[0]] || 'now';

  try {
    const {files}: {files: MessageAttachement[]} = await http({
      path: '/files.list',
      body: {
        // ts_to: cursor,
        // channel: channel || '',
        // user: user || '',
        // types: fileTypes && fileTypes.length ? fileTypes.join(',') : 'all',
      },
    });
    batch(() => {
      dispatch(storeEntities('files', files));
      dispatch(getFilesSuccess(files));
    });
  } catch (err) {
    dispatch(getFilesFail());
  }
};
