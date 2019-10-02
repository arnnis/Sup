import React, {FC} from 'react';
import {
  InputToolbar as GInputToolbar,
  InputToolbarProps,
} from 'react-native-gifted-chat';
import withTheme, {ThemeInjectedProps} from '../../contexts/theme/withTheme';

type Props = ThemeInjectedProps & {
  props: InputToolbarProps;
};

const InputToolbar: FC<Props> = ({props, theme}) => {
  return (
    <GInputToolbar
      {...props}
      containerStyle={{
        backgroundColor: theme.backgroundColor,
        borderTopColor: theme.backgroundColorLess1,
      }}
    />
  );
};

export default withTheme(InputToolbar);
