import {Reducer} from 'redux';
import {RootAction} from '../actions';
import { createSelector } from 'reselect';
import { RootState } from '.';

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
  currentTeam: '',
  list: [
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

export const meSelector = createSelector(
  (state: RootState) => state,
  state =>
    state.entities.users.byId[
      state.teams.list.find(tm => tm.id === state.teams.currentTeam)?.userId
    ],
);

export const currentTeamTokenSelector = createSelector(
  [(state: RootState) => state.teams.list, (state: RootState) => state.teams.currentTeam],
  (teamsList, currentTeamId) => teamsList.find(tm => tm.id === currentTeamId)?.token,
);

export const currentTeamSelector = createSelector(
  [(state: RootState) => state.teams, (state: RootState) => state.entities],
  (teams, entites) => entites.teams.byId[teams.list.find(tm => tm.id === teams.currentTeam)?.id],
);