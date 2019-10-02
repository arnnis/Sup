import React, {FC} from 'react';
import {
  Bubble as GBubble,
  BubbleProps,
  IMessage,
} from 'react-native-gifted-chat';
import withTheme, {ThemeInjectedProps} from '../../contexts/theme/withTheme';

type Props = ThemeInjectedProps & {
  props: BubbleProps<IMessage>;
};

const Bubble: FC<Props> = ({props, theme}) => {
  return (
    <GBubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: '#70CADB',
        },
        left: {backgroundColor: theme.backgroundColorLess1},
      }}
      textStyle={{right: {}, left: {color: theme.foregroundColor}}}
    />
  );
};

export default withTheme(Bubble);
