import {createSlice, PayloadAction, createSelector} from '@reduxjs/toolkit';
import {RootState} from '../reducers';

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
  list: [],
  loading: {},
};

const teamsSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    signinTeamSuccess(
      state,
      action: PayloadAction<{token: string; teamId: string; userId: string}>,
    ) {
      let {teamId, userId, token} = action.payload;
      return {
        ...state,
        list: [{id: teamId, token, userId}, ...state.list],
      };
    },
    getTeamStart(state, action: PayloadAction<{teamId: string}>) {
      let {teamId} = action.payload;
      return {
        ...state,
        loading: {
          ...state.loading,
          [teamId]: true,
        },
      };
    },
    getTeamSuccess(state, action: PayloadAction<{teamId: string}>) {
      let {teamId} = action.payload;
      return {
        ...state,
        loading: {
          ...state.loading,
          [teamId]: false,
        },
      };
    },
    getTeamFail(state, action: PayloadAction<{teamId: string}>) {
      this.getTeamStart(state, action);
    },

    setCurrentTeam(state, action: PayloadAction<{teamId: string}>) {
      let {teamId} = action.payload;
      return {
        ...state,
        currentTeam: teamId,
      };
    },
    logout(state, action: PayloadAction<{teamId: string}>) {
      let {teamId} = action.payload;
      return {
        ...state,
        currentTeam: teamId === state.currentTeam ? '' : state.currentTeam,
        list: state.list.filter((tm) => tm.id !== teamId),
      };
    },
  },
});

export const teamsReducer = teamsSlice.reducer;

export const {
  signinTeamSuccess,
  getTeamStart,
  getTeamSuccess,
  getTeamFail,
  setCurrentTeam,
  logout,
} = teamsSlice.actions;

export const meSelector = createSelector(
  (state: RootState) => state,
  (state) =>
    state.entities.users.byId[
      state.teams.list.find((tm) => tm.id === state.teams.currentTeam)?.userId ?? ''
    ],
);

export const currentTeamTokenSelector = createSelector(
  [(state: RootState) => state.teams.list, (state: RootState) => state.teams.currentTeam],
  (teamsList, currentTeamId) => teamsList.find((tm) => tm.id === currentTeamId)?.token,
);

export const currentTeamSelector = createSelector(
  [(state: RootState) => state.teams, (state: RootState) => state.entities],
  (teams, entites) =>
    entites.teams.byId[teams.list.find((tm) => tm.id === teams.currentTeam)?.id ?? ''],
);
