import React, {FC} from 'react';
import {Text, StyleSheet} from 'react-native';

interface Props {
  text: string;
}

const Code: FC<Props> = ({text}) => <Text style={styles.text}>{text}</Text>;

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Lucida Console',
    backgroundColor: 'gray',
    color: '#fff',
  },
});

export default Code;
