import {Reducer} from 'redux';
import {RootAction} from '../actions';

export type UsersState = Readonly<{
  list: Array<string>;
  listLoading: boolean;

  uploadDialog: {
    open: boolean;
    params: any;
  };
}>;

const initialState: UsersState = {
  list: [],
  listLoading: false,

  uploadDialog: {
    open: false,
    params: null,
  },
};

export const filesReducer: Reducer<UsersState, RootAction> = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_FILES_START': {
      return {
        ...state,
        listLoading: true,
      };
    }

    case 'GET_FILES_SUCCESS': {
      let {files} = action.payload;
      return {
        ...state,
        listLoading: false,
        list: files.map(file => file.id),
      };
    }

    case 'GET_FILES_FAIL': {
      return {
        ...state,
        listLoading: false,
      };
    }

    case 'OPEN_UPLOAD_DIALOG': {
      const {params} = action.payload;
      return {
        ...state,
        uploadDialog: {
          open: true,
          params,
        },
      };
    }

    case 'CLOSE_UPLOAD_DIALOG': {
      return {
        ...state,
        uploadDialog: initialState.uploadDialog,
      };
    }

    case 'SET_CURRENT_TEAM': {
      return initialState;
    }

    default:
      return state;
  }
};
