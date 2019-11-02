import React, {PureComponent, Component} from 'react';
import {connect, DispatchProp} from 'react-redux';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import AnimatedEllipsis from 'react-native-animated-ellipsis';
import px from '../../utils/normalizePixel';
import {Chat, User} from '../../models';
import Avatar from '../../components/Avatar';
import {RootState} from '../../reducers';
import {getChatLastMessage} from '../../actions/chats/thunks';
import withTheme, {ThemeInjectedProps} from '../../contexts/theme/withTheme';
import Touchable from '../../components/Touchable';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import {NavigationInjectedProps, withNavigation} from 'react-navigation';
import MessageText from '../ChatUI/MessageText';
import {setCurrentChat} from '../../actions/chats';
import getCurrentOrientaion from '../../utils/stylesheet/getCurrentOrientaion';
import isLandscape from '../../utils/stylesheet/isLandscape';
import ChatAvatar from './ChatAvatar';

dayjs.extend(utc);

type Props = ReturnType<typeof mapStateToProps> &
  NavigationInjectedProps &
  ThemeInjectedProps &
  DispatchProp<any> & {
    chatId: string;
  };

class ChatCell extends PureComponent<Props> {
  static whyDidYouRender = true;
  componentDidMount() {
    let {chatId} = this.props;
    this.props.dispatch(getChatLastMessage(chatId));
  }

  // shouldComponentUpdate(nextProps: Props) {
  //   let currentChat = this.props.chat
  //   let nextChat = nextProps.chat
  //   let currentUser = this.props.user
  //   let nextUser = nextProps.user

  //   if (
  //     (currentChat?.unread_count !== nextChat?.unread_count) ||
  //     (currentChat?.dm_count !== nextChat?.dm_count) ||
  //     (currentChat?.name !== nextChat?.name) ||
  //     (currentUser?.profile?.display_name_normalized !== nextUser?.profile?.display_name_normalized ) ||
  //     (currentUser?.profile?.real_name_normalized !== nextUser?.profile?.real_name_normalized ) ||
  //     (this.props.chatLastMessageStatus?.loading !== nextProps.chatLastMessageStatus?.loading)
  //   )
  //     return true
  //   return false
  // }

  handlePress = () => {
    this.props.dispatch(setCurrentChat(this.props.chatId));
    if (getCurrentOrientaion() === 'portrait')
      this.props.navigation.navigate('ChatUI', {chatId: this.props.chatId});
  };

  renderAvatar() {
    let {chatId, selected} = this.props;
    return <ChatAvatar chatId={chatId} selected={selected} />;
  }

  renderName(user: User) {
    let {chat, isChannel, theme, selected} = this.props;
    if (!isChannel && !user) {
      return (
        <AnimatedEllipsis
          style={{
            marginBottom: -px(3),
            fontSize: px(15),
            color: '#fff',
          }}
        />
      );
    }
    return (
      <Text style={[styles.name, {color: selected ? '#fff' : theme.foregroundColor}]}>
        {isChannel
          ? chat.name
          : user.profile.display_name_normalized || user.profile.real_name_normalized}
      </Text>
    );
  }

  renderLastMessage() {
    let {chatLastMessageStatus, lastMessage, chat, theme} = this.props;

    if (!chatLastMessageStatus) return null;

    if (chatLastMessageStatus.loading) {
      return (
        <AnimatedEllipsis
          style={{
            marginBottom: -px(3),
            fontSize: px(15),
            color: theme.purple,
          }}
        />
      );
    }

    if (!lastMessage) return null;

    return (
      <View>
        <MessageText
          messageId={lastMessage.ts}
          style={[styles.lastMessage, {color: theme.backgroundColorLess5}]}
          textProps={{numberOfLines: 1}}
        />
      </View>
    );
  }

  renderDate() {
    let {chatLastMessageStatus, lastMessage, chat, theme} = this.props;

    if (!chatLastMessageStatus) return null;

    if (chatLastMessageStatus.loading) {
      return null;
      return (
        <AnimatedEllipsis
          style={{
            marginBottom: -px(3),
            fontSize: px(15),
            color: theme.purple,
          }}
        />
      );
    }

    let data =
      chatLastMessageStatus.messageId &&
      dayjs.unix(Number(chatLastMessageStatus.messageId.split('.')[0])).format('HH:MM');

    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={[styles.date, {color: theme.backgroundColorLess4}]}>{data}</Text>
      </View>
    );
  }

  renderUnreadCount() {
    let {chat, isChannel, selected} = this.props;
    let unread = isChannel ? chat.unread_count : chat.dm_count;

    if (!unread) return null;
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View style={styles.unreadCountContainer}>
          <Text style={styles.unreadCount}>{unread}</Text>
        </View>
      </View>
    );
  }

  render() {
    let {user, theme, selected} = this.props;
    return (
      <Touchable
        style={[
          styles.container,
          {
            backgroundColor:
              selected && isLandscape() ? 'rgba(72.0, 32.0, 70.0, 1)' : theme.backgroundColor,
            borderColor: theme.backgroundColorLess1,
          },
        ]}
        onPress={this.handlePress}>
        {this.renderAvatar()}
        <View style={{flex: 1, marginLeft: px(10), paddingRight: px(15)}}>
          {this.renderName(user)}
          {this.renderLastMessage()}
        </View>
        <View style={styles.rightContainer}>
          {this.renderUnreadCount()}
          {this.renderDate()}
        </View>
      </Touchable>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: px(72),
    backgroundColor: '#FEFEFE',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: px(7.5),
    borderBottomWidth: px(1),
    borderColor: '#eee',
  },
  name: {
    fontWeight: '700',
    fontSize: px(14),
  },
  lastMessage: {
    color: '#8B8B8B',
    marginTop: px(3),
    fontSize: px(13.5),
  },
  rightContainer: {
    width: px(60),
    height: '100%',
    paddingVertical: px(5),
  },
  date: {
    fontSize: px(12),
  },
  unreadCountContainer: {
    minWidth: px(20),
    minHeight: px(20),
    backgroundColor: '#3D2037',
    borderRadius: px(10),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: px(4),
  },
  unreadCount: {
    fontSize: px(12),
    color: '#fff',
    fontWeight: '500',
  },
});

const mapStateToProps = (state: RootState, ownProps) => {
  let chat = state.entities.chats.byId[ownProps.chatId];
  let user = state.entities.users.byId[chat.user_id];
  let chatLastMessageStatus = state.chats.lastMessages[chat.id];
  let lastMessage =
    chatLastMessageStatus &&
    chatLastMessageStatus.messageId &&
    state.entities.messages.byId[chatLastMessageStatus.messageId];

  return {
    chat,
    user,
    isChannel: !chat.is_im,
    chatLastMessageStatus,
    lastMessage,
    selected: ownProps.chatId === state.chats.currentChatId,
  };
};

export default connect(mapStateToProps)(withNavigation(withTheme(ChatCell)));
