import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {User} from '../models';

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

const membersSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    getMembersStart(state) {
      state.loadingList = true;
    },
    getMembersSuccess(state, action: PayloadAction<{members: Array<User>}>) {
      let {members} = action.payload;
      state.list = [
        ...state.list,
        ...members.filter((member) => !member.is_bot).map((member) => member.id),
      ];
      state.loadingList = false;
    },
    getMembersFail(state) {
      state.loadingList = false;
    },

    getMemberStart(state, action: PayloadAction<{userId: string}>) {
      let {userId} = action.payload;
      state.loading[userId] = true;
    },
    getMemberSuccess(state, action: PayloadAction<{userId?: string}>) {
      let {userId} = action.payload;
      if (!userId) return;
      state.loading[userId] = false;
    },
    getMemberFail(state, action: PayloadAction<{userId?: string}>) {
      this.getMemberSuccess(state, action);
    },
  },
});

export const membersReducer = membersSlice.reducer;

export const {
  getMembersStart,
  getMembersSuccess,
  getMembersFail,
  getMemberStart,
  getMemberSuccess,
  getMemberFail,
} = membersSlice.actions;
