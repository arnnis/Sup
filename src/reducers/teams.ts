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
        'xoxs-746886436534-738318706257-784909639730-42d0b8a08e6a523683929b0628b3473608f8106eafc5ae2186f8d5fed7a484eb',
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
