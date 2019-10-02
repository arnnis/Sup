import {batch} from 'react-redux';
import http from '../../utils/http';
import {Chat, Message, PaginationResult} from '../../models';
import {storeEntities} from '../entities';
import {RootState} from '../../reducers';
import filterDirects from '../../utils/filterDirects';
import {getGroupsSuccess, getGroupsStart, getGroupsFail} from '.';

export const getGroups = () => async (dispatch, getState) => {
  let store: RootState = getState();
  let cursor = store.chats.nextCursor;
  if (cursor === 'end') return;

  try {
    dispatch(getGroupsStart());
    let x: {groups: Array<Chat>} & PaginationResult = await http({
      path: '/conversations.list',
      body: {
        types: 'im',
        limit: 5,
        cursor,
        include_count: true,
        unreads: 1,
      },
      isFormData: true,
    });
    debugger;
    let nextCursor = response_metadata ? response_metadata.next_cursor : 'end';

    batch(() => {
      dispatch(storeEntities('chats', ims.filter(filterDirects)));
      dispatch(getGroupsSuccess(ims, nextCursor));
    });

    //ims.forEach(c => dispatch(getDirectLastMessage(c.id)));
  } catch (err) {
    dispatch(getGroupsFail());
    console.log(err);
  }
};
