import React, {FC} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import withTheme, {ThemeInjectedProps} from '../../contexts/theme/withTheme';
import px from '../../utils/normalizePixel';
import Avatar from '../../components/Avatar';
import {RootState} from '../../reducers';
import {connect} from 'react-redux';

type Props = ReturnType<typeof mapStateToProps> &
  ThemeInjectedProps & {
    chatId: string;
    selected?: boolean;
    size: number;
  };

const ChatAvatar: FC<Props> = ({chat, isChannel, selected, size, theme}) =>
  isChannel ? (
    <View style={[styles.container, {width: size, height: size}]}>
      <Text
        style={[
          styles.hash,
          {
            color: selected ? theme.backgroundColor : theme.foregroundColor,
          },
        ]}>
        #
      </Text>
    </View>
  ) : (
    <Avatar userId={chat.user_id} width={size} />
  );

ChatAvatar.defaultProps = {
  size: px(50),
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: px(25),
    borderColor: '#ccc',
    borderWidth: StyleSheet.hairlineWidth,
  },
  hash: {
    fontWeight: 'bold',
    fontSize: px(16),
  },
});

const mapStateToProps = (state: RootState, ownProps) => {
  const chat = state.entities.chats.byId[ownProps.chatId];
  return {
    chat,
    isChannel: !chat.is_im,
  };
};

export default connect(mapStateToProps)(withTheme(ChatAvatar));
