import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {MessageAttachement} from '../models';

export type FilesState = Readonly<{
  list: Array<string>;
  listLoading: boolean;

  uploadDialog: {
    open: boolean;
    params: any;
  };
}>;

const initialState: FilesState = {
  list: [],
  listLoading: false,

  uploadDialog: {
    open: false,
    params: null,
  },
};

const filesSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    getFilesStart(state) {
      state.listLoading = true;
    },
    getFilesSuccess(state, action: PayloadAction<{files: MessageAttachement[]}>) {
      state.listLoading = false;
      state.list = action.payload.files.map((file) => file.id);
    },
    getFilesFail(state) {
      state.listLoading = false;
    },

    openUploadDialog(state, action: PayloadAction<{params: any}>) {
      state.uploadDialog = {
        open: true,
        params: action.payload.params,
      };
    },
    closeUploadDialog(state) {
      state.uploadDialog = initialState.uploadDialog;
    },
  },
});

export const filesReducer = filesSlice.reducer;
export const {
  getFilesStart,
  getFilesSuccess,
  getFilesFail,
  openUploadDialog,
  closeUploadDialog,
} = filesSlice.actions;
