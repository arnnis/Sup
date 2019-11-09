import React, {FC} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {RootState} from '../../reducers';
import {connect} from 'react-redux';
import Name from './Name';

type Props = ReturnType<typeof mapStateToProps> & {
  chatId: string;
};

const Typing: FC<Props> = ({typingUsers}) => {
  if (typingUsers && typingUsers.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          {typingUsers.slice(0, 2).map(userId => (
            <Name userId={userId} style={{color: '#fff'}} />
          ))}{' '}
          {typingUsers.length > 2 ? 'and' + (typingUsers.length - 2) + 'other' : ''} typing...
        </Text>
      </View>
    );
  }
  return null;
};

const styles = StyleSheet.create({
  container: {},
  text: {
    color: '#fff',
  },
});

const mapStateToProps = (state: RootState, ownProps) => ({
  typingUsers: state.chats.typingsUsers[ownProps.chatId],
});

export default connect(mapStateToProps)(Typing);
