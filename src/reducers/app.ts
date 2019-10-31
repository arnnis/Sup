import {Reducer} from 'redux';
import {RootAction} from '../actions';
import {ConnectionStatus} from '../actions/app';

export type AppState = Readonly<{
  drawerOpen: boolean;
  connectionStatus: ConnectionStatus;
  bottomSheet: {
    screen: string;
    params: any;
  };
}>;

const initialState: AppState = {
  drawerOpen: false,
  connectionStatus: 'connecting',
  bottomSheet: {
    screen: undefined,
    params: null,
  },
};

export const appReducer: Reducer<AppState, RootAction> = (state = initialState, action) => {
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

    case 'OPEN_BOTTOM_SHEET': {
      return {
        ...state,
        bottomSheet: action.payload,
      };
    }

    case 'CLOSE_BOTTOM_SHEET': {
      return {
        ...state,
        bottomSheet: {
          screen: undefined,
          params: null,
        },
      };
    }

    default:
      return state;
  }
};
