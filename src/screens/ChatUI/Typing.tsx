import React, {FC, memo} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {RootState} from '../../reducers';
import {useSelector} from 'react-redux';
import Name from './Name';

interface Props {
  chatId: string;
}

const Typing: FC<Props> = React.memo(({chatId}) => {
  const {typingUsers} = useSelector((state: RootState) => ({
    typingUsers: state.chats.typingsUsers[chatId],
  }));

  if (typingUsers && typingUsers.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          {typingUsers.slice(0, 2).map(userId => (
            <Name userId={userId} style={{color: '#fff'}} />
          ))}
          {typingUsers.length > 2 ? 'and' + (typingUsers.length - 2) + 'other' : ''} typing...
        </Text>
      </View>
    );
  }
  return null;
});

const styles = StyleSheet.create({
  container: {},
  text: {
    color: '#fff',
  },
});

export default Typing;
