import {getFilesStart, getFilesSuccess, getFilesFail} from './files-slice';
import {RootState} from '../reducers';
import http from '../utils/http';
import {MessageAttachement} from '../models';
import {batch} from 'react-redux';
import {storeEntities} from './entities-slice';
import {API_URL} from '../env';
import {currentTeamTokenSelector} from '../reducers/teams';
import {ProgressBarService} from '../contexts/progress-bar/provider';
import {AppThunk} from '../store/configureStore';

export const getFiles = (channel?: string, fileTypes?: string[], user?: string): AppThunk => async (
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
      dispatch(storeEntities({entity: 'files', data: files}));
      dispatch(getFilesSuccess({files}));
    });
  } catch (err) {
    dispatch(getFilesFail());
  }
};

export const uploadFileWeb = (
  file: File,
  channels: string[],
  comment?: string,
  threadId?: string,
): AppThunk => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    const url = `${API_URL}/files.upload`;
    const fd = new FormData();
    const token = currentTeamTokenSelector(getState());
    fd.append('file', file);
    fd.append('token', token || '');
    fd.append('channels', channels.join(','));
    comment && fd.append('initial_comment', comment);
    threadId && fd.append('thread_ts', threadId);

    const xhr = new XMLHttpRequest();

    const progressId = ProgressBarService.show({
      title: `Uploading ${file.name}`,
      onCancel: () => {
        xhr.abort();
        ProgressBarService.hide(progressId);
      },
    });

    xhr.upload.addEventListener(
      'progress',
      (e) => ProgressBarService.updateProgress(progressId, Math.ceil((e.loaded / e.total) * 100)),
      false,
    );
    xhr.addEventListener(
      'load',
      () => {
        resolve();
        ProgressBarService.hide(progressId);
      },
      false,
    );
    xhr.addEventListener('error', reject, false);
    //xhr.addEventListener('abort', reject, false);
    xhr.open('POST', url, true);
    xhr.send(fd);
  });
};
