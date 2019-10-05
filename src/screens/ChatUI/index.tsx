import React, {PureComponent, Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import {
  GiftedChat,
  IMessage as GMessage,
  User as GUser,
  MessageProps,
  SendProps,
  InputToolbarProps,
  BubbleProps,
  MessageImageProps,
  AvatarProps,
  Avatar,
} from 'react-native-gifted-chat';
import {connect, DispatchProp} from 'react-redux';
import {NavigationInjectedProps} from 'react-navigation';
import FastImage from 'react-native-fast-image';
import {RootState} from '../../reducers';
import {Message as TMessage, User} from '../../models';
import {addMessageToChat} from '../../actions/messages';
import {getMessages} from '../../actions/messages/thunks';
import Header from '../../components/Header';
import {sendMessage} from '../../services/rtm';
import withTheme, {ThemeInjectedProps} from '../../contexts/theme/withTheme';
import {markChatAsRead} from '../../actions/chats/thunks';
import Bubble from './Bubble';
import InputToolbar from './InputToolbar';
import SendButton from './SendButton';
import GiftedMessage from './Message';
import slackMessagetoGiftedMessage from './mappers/slack-message-to-gifted-message';
import pendingMessageToGiftedMessage from './mappers/pending-message-to-gifted-message';
import slackUserToGiftedUser from './mappers/slack-user-to-gifted-user';
import Username from './Username';
import Emoji from './Emoji';
import px from '../../utils/normalizePixel';
import {getMember} from '../../actions/members/thunks';
import memoizeOne from 'memoize-one';

type Props = ReturnType<typeof mapStateToProps> &
  ThemeInjectedProps &
  NavigationInjectedProps &
  DispatchProp<any> & {
    chatId: string;
  };

class ChatUI extends Component<Props> {
  async componentDidMount() {
    let {navigation, lastMessage, nextCursor, messages, dispatch} = this.props;
    let chatId = navigation.getParam('chatId');

    if (lastMessage && lastMessage.messageId && !lastMessage.loading) {
      dispatch(addMessageToChat(lastMessage.messageId, chatId));
    }

    if (nextCursor[chatId] !== 'end' && messages.length <= 1) {
      await dispatch(getMessages(chatId));
    }

    this.markChatAsRead();
  }

  componentDidUpdate(prevProps: Props) {
    let unreadCountIncreased = () => {
      let {currentChat} = this.props;
      let {currentChat: prevChat} = prevProps;
      let isGroup = !currentChat.is_im;

      if (currentChat && prevChat) {
        if (
          isGroup &&
          currentChat.unread_count &&
          currentChat.unread_count > prevChat.unread_count
        )
          return true;
        if (
          !isGroup &&
          currentChat.dm_count &&
          currentChat.dm_count > prevChat.dm_count
        )
          return true;
      }
      return false;
    };

    if (unreadCountIncreased()) {
      this.markChatAsRead();
    }
  }

  handleAvatarPress = (user: GUser) => {
    this.props.navigation.navigate('UserProfile', {userId: user._id});
  };

  markChatAsRead = () => {
    let {dispatch, navigation} = this.props;
    let chatId = navigation.getParam('chatId');
    dispatch(markChatAsRead(chatId, this.props.messages[0]._id));
  };

  getParsePatterns = () => {
    return [
      {
        pattern: RegExp(/<@[A-Z, 0-9]+>/g, 'g'),
        style: styles.username,
        renderText: this.renerUsername,
      },
      {
        pattern: RegExp(/:[A-z, 0-9]+:+/g, 'g'),
        style: styles.username,
        renderText: this.renderEmoji,
      },
    ];
  };

  renerUsername = (username: string) => <Username username={username} />;

  renderEmoji = (name: string) => {
    name = name.replace(/:/g, '');
    return <Emoji name={name} />;
  };

  renerChatName = (chatName: string) => {
    chatName = chatName.split('|')[1].replace('>', '');

    return <Text>{chatName}</Text>;
  };

  renderMessage = (props: MessageProps<GMessage>) => (
    <GiftedMessage props={props} />
  );

  renderMessageImage = (props: MessageImageProps<GMessage>) => (
    <FastImage
      {...props.imageProps}
      style={{width: px(100), height: px(100)}}
      source={{
        uri: props.currentMessage.image,
        headers: {
          Authorization: 'Bearer ' + this.props.currentTeamToken,
        },
      }}
      resizeMode="cover"
      onLoad={() => null}
      onError={() => null}
    />
  );

  renderBubble = (props: BubbleProps<GMessage>) => {
    return <Bubble props={props} />;
  };

  renderSend = (props: SendProps) => <SendButton props={props} />;

  renderInputToolbar = (props: InputToolbarProps) => (
    <InputToolbar props={props} />
  );

  renderAvatar = (props: AvatarProps<GMessage>) => {
    let isLoadingMember = props.currentMessage.user._id === 'loading';

    if (isLoadingMember)
      return (
        <View
          style={{
            width: 45,
            height: 45,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size="small" color="#fff" />
        </View>
      );

    return <Avatar {...props} />;
  };

  render() {
    let {
      me,
      currentChat,
      currentUser,
      loading,
      messages,
      nextCursor,
      isGroup,
      dispatch,
      theme,
    } = this.props;

    if (!currentChat) return null;

    return (
      <SafeAreaView style={[styles.container, {backgroundColor: '#3D2037'}]}>
        <Header
          center={
            isGroup
              ? currentChat.name_normalized
              : currentUser.profile.display_name_normalized ||
                currentUser.profile.real_name_normalized
          }
          left="back"
        />
        <View style={{backgroundColor: theme.backgroundColor, flex: 1}}>
          <GiftedChat
            messages={messages}
            user={slackUserToGiftedUser(me)}
            onLoadEarlier={() => dispatch(getMessages(currentChat.id))}
            isLoadingEarlier={loading && messages.length > 1}
            loadEarlier={
              nextCursor && nextCursor !== 'end' && messages.length > 1
            }
            scrollToBottom={false}
            parsePatterns={this.getParsePatterns}
            onPressAvatar={this.handleAvatarPress}
            onSend={(messages: GMessage[]) => {
              sendMessage({
                type: 'message',
                text: messages[0].text,
                channel: currentChat.id,
              });
            }}
            renderUsernameOnMessage={!currentChat.is_im}
            showUserAvatar={!currentChat.is_im}
            renderMessage={this.renderMessage}
            renderBubble={this.renderBubble}
            renderSend={this.renderSend}
            renderInputToolbar={this.renderInputToolbar}
            renderMessageImage={this.renderMessageImage}
            renderAvatar={this.renderAvatar}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  username: {
    color: '#1264A3',
  },
});

let defaultList = [];
const mapStateToProps = (state: RootState, ownProps) => {
  let chatId = ownProps.navigation.getParam('chatId');
  let currentChat = state.entities.chats.byId[chatId];
  let currentUser =
    currentChat && state.entities.users.byId[currentChat.user_id];

  let me =
    state.entities.users.byId[
      state.teams.list.find(ws => ws.id === state.teams.currentTeam).userId
    ];

  let messagesList = state.messages.list[chatId] || defaultList;
  let pendingMessages = state.messages.pendingMessages[chatId] || defaultList;
  let messages = convertMessages(
    state.entities,
    messagesList,
    pendingMessages,
    me,
  );

  return {
    chatId,
    currentChat,
    currentUser,
    messages,
    nextCursor: state.messages.nextCursor[chatId],
    loading: state.messages.loading[chatId],
    isGroup: currentChat && !currentChat.is_im,
    lastMessage: state.chats.lastMessages[chatId],
    pendingMessages,
    me:
      state.entities.users.byId[
        state.teams.list.find(ws => ws.id === state.teams.currentTeam).userId
      ],
    currentTeamToken: state.teams.list.find(
      ws => ws.id === state.teams.currentTeam,
    ).token,
  };
};

const convertMessages = memoizeOne(
  (entities, messagesList, pendingMessages, me): GMessage[] => {
    let messages: GMessage[] = [];

    // Pending messages
    if (pendingMessages.length > 0) {
      for (let pendingMessage of pendingMessages) {
        let gMessage: GMessage = pendingMessageToGiftedMessage(
          pendingMessage,
          me,
        );
        messages.push(gMessage);
      }
    }

    // Chat messages
    for (let messageId of messagesList) {
      let message: TMessage = entities.messages.byId[messageId];
      let user: User = entities.users.byId[message.user];
      let gMessage: GMessage = slackMessagetoGiftedMessage(message, user);
      messages.push(gMessage);
    }
    return messages;
  },
);

export default connect(mapStateToProps)(withTheme(ChatUI));
