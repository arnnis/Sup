import {Reducer} from 'redux';
import {RootAction} from '../actions';

export type UsersState = Readonly<{
  list: Array<string>;
  loadingList: boolean;
  loading: {[userId: string]: boolean};
}>;

const initialState: UsersState = {
  list: [],
  loadingList: false,
  loading: {},
};

export const membersReducer: Reducer<UsersState, RootAction> = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_ALL_MEMBERS_START': {
      return {
        ...state,
        loadingList: true,
      };
    }

    case 'GET_ALL_MEMBERS_SUCCESS': {
      let {members} = action.payload;
      return {
        ...state,
        list: [...state.list, ...members.filter(member => !member.is_bot).map(member => member.id)],
        loadingList: false,
      };
    }

    case 'GET_ALL_MEMBERS_FAIL': {
      return {
        ...state,
        loadingList: false,
      };
    }

    case 'GET_MEMBER_START': {
      let {userId} = action.payload;
      return {
        ...state,
        loading: {
          ...state.loading,
          [userId]: true,
        },
      };
    }

    case 'GET_MEMBER_SUCCESS':
    case 'GET_MEMBER_FAIL': {
      let {userId} = action.payload;
      return {
        ...state,
        loading: {
          ...state.loading,
          [userId]: false,
        },
      };
    }

    case 'SET_CURRENT_TEAM': {
      return initialState;
    }

    default:
      return state;
  }
};
