import React, {useContext} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import px from '../../utils/normalizePixel';
import ThemeContext from '../../contexts/theme';

export default () => {
  let {theme} = useContext(ThemeContext);
  return (
    <View style={styles.container}>
      <Text style={[styles.text, {color: theme.foregroundColor}]}>
        Please signin into a team from sidemenu (+) to get started.
      </Text>
    </View>
  );
};

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
