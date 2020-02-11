import React, {FC} from 'react';
import {useSelector} from 'react-redux';
import {Text, StyleSheet, TextStyle} from 'react-native';

import {RootState} from '../../reducers';
import px from '../../utils/normalizePixel';

interface Props {
  style?: TextStyle;
  chatId: string;
}

const ChatMembersCount: FC<Props> = ({chatId, style}) => {
  const {chat, fullLoad} = useSelector((state: RootState) => ({
    chat: state.entities.chats.byId[chatId],
    fullLoad: state.chats.fullLoad[chatId],
  }));

  return (
    <Text style={[styles.membersCount, style]}>
      {fullLoad?.loading ? '...' : fullLoad?.loaded ? `${chat?.num_members}` : ''} members
    </Text>
  );
};

const styles = StyleSheet.create({
  membersCount: {
    color: '#fff',
    marginTop: px(2.5),
    fontSize: px(13.5),
  },
});

export default ChatMembersCount;
