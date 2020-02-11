import React, {FC, memo} from 'react';
import {Text, StyleSheet} from 'react-native';
import px from '../../utils/normalizePixel';

interface Props {
  text: string;
}

const Code: FC<Props> = React.memo(({text}) => <Text style={styles.text}>{text}</Text>);

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Lucida Console',
    backgroundColor: 'gray',
    color: '#fff',
    fontSize: px(14),
  },
});

export default Code;
