import React, {FC} from 'react';
import {
  Message as GiftedMessage,
  MessageProps,
  IMessage,
} from 'react-native-gifted-chat';
import withTheme, {ThemeInjectedProps} from '../../contexts/theme/withTheme';
import Reactions from './Reactions';

type Props = ThemeInjectedProps & {
  props: MessageProps<IMessage>;
};

const Message: FC<Props> = ({props, theme}) => {
  return (
    <>
      <Reactions gMessage={props.currentMessage} />
      <GiftedMessage {...props} />
    </>
  );
};

export default withTheme(Message);
