import {Reducer} from 'redux';
import {RootAction} from '../actions';
import {ConnectionStatus} from '../actions/app';

export type AppState = Readonly<{
  drawerOpen: boolean;
  connectionStatus: ConnectionStatus;
}>;

const initialState: AppState = {
  drawerOpen: false,
  connectionStatus: 'connecting',
};

export const appReducer: Reducer<AppState, RootAction> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case 'SET_DRAWER_OPEN': {
      let {drawerState} = action.payload;
      return {
        ...state,
        drawerOpen: drawerState,
      };
    }

    case 'SET_CONNECTION_STATUS': {
      let {status} = action.payload;
      return {
        ...state,
        connectionStatus: status,
      };
    }

    default:
      return state;
  }
};
