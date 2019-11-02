import React, { FC } from 'react';
import {RootState} from '../../reducers';
import { connect } from 'react-redux';
import { Text, StyleSheet } from 'react-native';
import px from '../../utils/normalizePixel';

type Props = ReturnType<typeof mapStateToProps>

const ChatMembersCount: FC<Props> = ({fullLoad, chat}) => {
  return <Text style={styles.membersCount}>{fullLoad?.loading? '...' : fullLoad?.loaded? `${chat?.num_members}`: ''} members</Text>
};

const styles = StyleSheet.create({
  membersCount: {
    color: '#fff',
    marginTop: px(2.5),
    fontSize: px(13.5),
  },
})

const mapStateToProps = (state: RootState, ownProps) => ({
  chat: state.entities.chats.byId[ownProps.chatId],
  fullLoad: state.chats.fullLoad[ownProps.chatId],
});

export default connect(mapStateToProps)(ChatMembersCount) ;
