import {Presence} from '../models';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected';

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

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setConnectionStatus(state, action: PayloadAction<ConnectionStatus>) {
      state.connectionStatus = action.payload;
    },
    setDrawerOpen(state, action: PayloadAction<{drawerState: boolean}>) {
      let {drawerState} = action.payload;
      state.drawerOpen = drawerState;
    },
    openBottomSheet(state, action: PayloadAction<{screen: string; params?: any}>) {
      const {screen, params} = action.payload;
      state.bottomSheet = {
        screen,
        params,
      };
    },
    closeBottomSheet(state) {
      state.bottomSheet = {
        screen: undefined,
        params: null,
      };
    },
    toggleToast(state, action: PayloadAction<{toast: AppState['toast']}>) {
      state.toast = action.payload.toast;
    },
    setPresence(state, action: PayloadAction<{presence: Presence}>) {
      state.presence = action.payload.presence;
    },
  },
});

export const appReducer = appSlice.reducer;

export const {
  setConnectionStatus,
  setDrawerOpen,
  openBottomSheet,
  closeBottomSheet,
  toggleToast,
  setPresence,
} = appSlice.actions;
