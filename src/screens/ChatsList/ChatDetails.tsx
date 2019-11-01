import React, {Component} from 'react';
import {View, StyleSheet, SafeAreaView} from 'react-native';
import {InfoBox} from '../../components/InfoBox';
import Avatar from '../../components/Avatar';

class ChatDetails extends Component {
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <InfoBox style={{flexDirection: 'row'}}>
          <Avatar />
        </InfoBox>
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
