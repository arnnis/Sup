import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import px from '../../utils/normalizePixel';

export default () => (
  <View style={styles.container}>
    <Text style={styles.text}>Please signin into a team from sidemenu to get started.</Text>
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
    marginHorizontal: px(25),
    textAlign: 'center',
  },
});
