import {getFilesStart, getFilesSuccess, getFilesFail} from '.';
import {RootState} from '../../reducers';
import http from '../../utils/http';
import {MessageAttachement} from '../../models';
import {batch} from 'react-redux';
import {storeEntities} from '../entities';
import {API_URL} from '../../env';
import {currentTeamTokenSelector} from '../../reducers/teams';
import {ProgressBarService} from '../../contexts/progress-bar/provider';

export const getFiles = (channel?: string, fileTypes?: string[], user?: string) => async (
  dispatch,
  getState,
) => {
  const state: RootState = getState();

  if (state.files.listLoading) return;

  dispatch(getFilesStart());

  const cursor = state.entities.files.byId[state.files.list[0]]?.timestamp ?? 'now';

  try {
    const {files}: {files: MessageAttachement[]} = await http({
      path: '/files.list',
      body: {
        ts_to: cursor,
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

export const uploadFileWeb = (file: File, channels: string[]) => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    const url = `${API_URL}/files.upload`;
    const fd = new FormData();
    const token = currentTeamTokenSelector(getState());
    fd.append('file', file);
    fd.append('token', token);
    fd.append('channels', channels.join(','));

    const progressId = ProgressBarService.show({title: `Uploading ${file.name}`});

    const xhr = new XMLHttpRequest();
    xhr.upload.addEventListener(
      'progress',
      e => ProgressBarService.updateProgress(progressId, Math.ceil((e.loaded / e.total) * 100)),
      false,
    );
    xhr.addEventListener('load', resolve, false);
    xhr.addEventListener('error', reject, false);
    xhr.addEventListener('abort', reject, false);
    xhr.open('POST', url, true);
    xhr.send(fd);
  });
};
