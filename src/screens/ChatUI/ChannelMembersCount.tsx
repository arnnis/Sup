import React, { FC } from 'react';
import {RootState} from '../../reducers';
import { connect } from 'react-redux';
import { Text, StyleSheet, TextStyle } from 'react-native';
import px from '../../utils/normalizePixel';

type Props = ReturnType<typeof mapStateToProps> & {
  style?: TextStyle
}

const ChatMembersCount: FC<Props> = ({fullLoad, chat, style}) => {
  return <Text style={[styles.membersCount, style]}>{fullLoad?.loading? '...' : fullLoad?.loaded? `${chat?.num_members}`: ''} members</Text>
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
