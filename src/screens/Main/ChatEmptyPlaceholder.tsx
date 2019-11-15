import React, {FC} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import px from '../../utils/normalizePixel';
import withTheme, {ThemeInjectedProps} from '../../contexts/theme/withTheme';

type Props = ThemeInjectedProps;

const ChatEmptyPlaceholder: FC<Props> = ({theme}) => (
  <View style={[styles.container, {backgroundColor: theme.backgroundColorDarker1}]}>
    <Text style={[styles.text, {color: theme.foregroundColor}]}>
      Select a chat to start messenging
    </Text>
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

export default withTheme(ChatEmptyPlaceholder);
