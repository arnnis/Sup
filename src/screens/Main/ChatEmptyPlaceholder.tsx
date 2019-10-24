import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import px from '../../utils/normalizePixel';

const ChatEmptyPlaceholder = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Please select a chat to start messenging</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
  },
  text: {
    color: '#333',
    fontSize: px(15),
  },
});

export default ChatEmptyPlaceholder;
