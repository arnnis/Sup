import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default () => (
  <View style={styles.container}>
    <Text style={styles.text}>Please signin into a team from side to get started.</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
  },
});
