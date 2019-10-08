import {Reducer} from 'redux';
import {RootAction} from '../actions';

export type TeamsState = Readonly<{
  currentTeam: string;
  list: Array<{
    id: string;
    userId: string;
    token: string;
  }>;
  loading: {[teamId: string]: boolean};
}>;

const initialState: TeamsState = {
  currentTeam: 'TMYS2CUFQ',
  list: [
    {
      id: 'TMYS2CUFQ',
      token:
        'xoxs-746886436534-738318706257-780860807956-f4e6ee07637c5630275a09c49dd7d2b4d65cef4aa50a84678a197be75cd2190e',
      userId: 'UMQ9CLS7K',
    },
  ],
  loading: {},
};

export const teamsReducer: Reducer<TeamsState, RootAction> = (state = initialState, action) => {
  switch (action.type) {
    case 'SIGNIN_TEAM_SUCCESS': {
      let {teamId, userId, token} = action.payload;
      return {
        ...state,
        list: [{id: teamId, token, userId}, ...state.list],
      };
    }

    case 'GET_TEAM_START': {
      let {teamId} = action.payload;
      return {
        ...state,
        loading: {
          ...state.loading,
          [teamId]: true,
        },
      };
    }

    case 'GET_TEAM_FAIL':
    case 'GET_TEAM_SUCCESS': {
      let {teamId} = action.payload;
      return {
        ...state,
        loading: {
          ...state.loading,
          [teamId]: false,
        },
      };
    }

    case 'SET_CURRENT_TEAM': {
      let {teamId} = action.payload;
      return {
        ...state,
        currentTeam: teamId,
      };
    }

    case 'LOGOUT': {
      let {teamId} = action.payload;
      return {
        ...state,
        currentTeam: teamId === state.currentTeam ? '' : state.currentTeam,
        list: state.list.filter(tm => tm.id !== teamId),
      };
    }

    default:
      return state;
  }
};
