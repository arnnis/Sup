import {Reducer} from 'redux';
import {RootAction} from '../actions';

export type UsersState = Readonly<{
  list: Array<string>;
  listLoading: boolean;
}>;

const initialState: UsersState = {
  list: [],
  listLoading: false,
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
    case 'SET_CURRENT_TEAM': {
      return {
        list: [],
        listLoading: false,
      };
    }

    default:
      return state;
  }
};
