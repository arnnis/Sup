import React, {Component} from 'react';
import {View, StyleSheet, SafeAreaView} from 'react-native';

class ChatDetails extends Component {
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.box}></View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  box: {},
});

export default ChatDetails;
