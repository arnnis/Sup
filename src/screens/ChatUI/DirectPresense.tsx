import React, { FC } from 'react';
import {RootState} from '../../reducers';
import { connect } from 'react-redux';
import { Text, StyleSheet } from 'react-native';
import px from '../../utils/normalizePixel';

type Props = ReturnType<typeof mapStateToProps> & {
  chatId: string
}

const DirectPresense: FC<Props> = ({user}) => {
  return <Text style={styles.membersCount}>{user?.presence === "active"? 'online' : 'offline'}</Text>
};

const styles = StyleSheet.create({
  membersCount: {
    color: '#fff',
    marginTop: px(2.5),
    fontSize: px(13.5),
  },
})

const mapStateToProps = (state: RootState, ownProps) => {
  let chat = state.entities.chats.byId[ownProps.chatId];
  let user = state.entities.users.byId[chat?.user_id];
  return {
    user,
  }
}

export default connect(mapStateToProps)(DirectPresense) ;
