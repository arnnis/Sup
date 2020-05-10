import {Reducer} from 'redux';
import {RootAction} from '../actions';
import {ConnectionStatus} from '../slices/app-slice';
import {Presence} from '../models';

export type AppState = Readonly<{
  drawerOpen: boolean;
  connectionStatus: ConnectionStatus;
  bottomSheet: {
    screen: string | undefined;
    params: any;
  };
  toast: {
    message: string;
    userId?: string; // used when toast is about a community member (e.g. presense change)
    icon?: 'success' | 'fail';
  };

  presence: Presence;
}>;

const initialState: AppState = {
  drawerOpen: false,
  connectionStatus: 'connecting',
  bottomSheet: {
    screen: undefined,
    params: null,
  },
  toast: {
    message: '',
    userId: '',
  },
  presence: 'auto',
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

    case 'TOGGLE_TOAST': {
      return {
        ...state,
        toast: action.payload.toast,
      };
    }

    case 'SET_PRESENCE': {
      return {
        ...state,
        presence: action.payload.presence,
      };
    }

    default:
      return state;
  }
};
