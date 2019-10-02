import React, {FC} from 'react';
import {Send, SendProps} from 'react-native-gifted-chat';
import withTheme, {ThemeInjectedProps} from '../../contexts/theme/withTheme';

type Props = ThemeInjectedProps & {
  props: SendProps;
};

const SendButton: FC<Props> = ({props, theme}) => {
  return (
    <Send
      {...props}
      containerStyle={{backgroundColor: theme.backgroundColor}}
    />
  );
};

export default withTheme(SendButton);
