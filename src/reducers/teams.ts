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
  loggingIn: boolean;
}>;

const initialState: TeamsState = {
  currentTeam: 'T0ED8BPHS',
  list: [],
  loading: {},
  loggingIn: false,
};

export const teamsReducer: Reducer<TeamsState, RootAction> = (
  state = initialState,
  action,
) => {
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

    default:
      return state;
  }
};
