import React, {Component} from 'react';
import {View, SafeAreaView, StyleSheet, FlatList, ActivityIndicator, Text} from 'react-native';
import {RootState} from '../../reducers';
import {connect, DispatchProp} from 'react-redux';
import Message from './Message';
import {NavigationInjectedProps, withNavigation} from 'react-navigation';
import {addMessageToChat} from '../../actions/messages';
import {getMessagesByChatId, getRepliesByThreadId} from '../../actions/messages/thunks';
import {markChatAsRead, getChatInfo} from '../../actions/chats/thunks';
import Header from '../../components/Header';
import withTheme, {ThemeInjectedProps} from '../../contexts/theme/withTheme';
import InputToolbar from './InputToolbar';
import {getMember} from '../../actions/members/thunks';
import isLandscape from '../../utils/stylesheet/isLandscape';
import { meSelector, currentTeamTokenSelector } from '../../reducers/teams';
import px from '../../utils/normalizePixel';
import Touchable from '../../components/Touchable';
import ChannelMembersCount from './ChannelMembersCount';
import DirectPresense from './DirectPresense';

export type ChatType = 'direct' | 'channel' | 'thread';

type Props = ReturnType<typeof mapStateToProps> &
  NavigationInjectedProps &
  DispatchProp<any> &
  ThemeInjectedProps & {
    chatId: string;
    threadId: string;
    chatType: ChatType;
  };
class ChatUI extends Component<Props> {
  async componentDidMount() {
    let {chatType, chatId, dispatch} = this.props;
    if (chatType === 'channel' || chatType === 'direct') {
      this.getMessage();
      dispatch(getChatInfo(chatId))
    }

    if (chatType === 'thread') {
      this.getReplies();
    }
  }

  componentDidUpdate(prevProps: Props) {
    let unreadCountIncreased = () => {
      let {currentChat, chatType} = this.props;
      let {currentChat: prevChat} = prevProps;

      if (currentChat && prevChat) {
        if (
          chatType === 'channel' &&
          currentChat.unread_count &&
          currentChat.unread_count > prevChat.unread_count
        )
          return true;
        if (
          chatType === 'direct' &&
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

    let chatChanged = this.props.chatId !== prevProps.chatId
    if (chatChanged) {
      this.componentDidMount()
    }
  }

  async getMessage() {
    let {
      navigation,
      lastMessageStatus,
      lastMessage,
      nextCursor,
      messagesList,
      dispatch,
      chatId,
    } = this.props;
    if (lastMessageStatus && lastMessageStatus.messageId && !lastMessageStatus.loading) {
      dispatch(addMessageToChat(lastMessageStatus.messageId, chatId));
      dispatch(getMember(lastMessage.user));
    }

    if (nextCursor && nextCursor[chatId] !== 'end' && messagesList.length <= 1) {
      await dispatch(getMessagesByChatId(chatId));
    }

    this.markChatAsRead();
  }

  getReplies() {
    let {dispatch, threadId, chatId} = this.props;

    dispatch(getRepliesByThreadId(threadId, chatId));
  }

  getOlderMessages = () => {
    let {chatType, chatId, threadId} = this.props;
    if (chatType === 'channel' || chatType === 'direct') {
      this.props.dispatch(getMessagesByChatId(chatId));
    }

    if (chatType === 'thread') {
      this.props.dispatch(getRepliesByThreadId(threadId, chatId));
    }
  };

  markChatAsRead = () => {
    let {dispatch, chatId} = this.props;
    dispatch(markChatAsRead(chatId, this.props.messagesList[0]));
  };

  openChatDetails = () => {
    let {chatId, chatType, currentUser} = this.props;
    if (chatType === "channel")
      this.props.navigation.navigate('ChannelDetails', { chatId })
    if (chatType === "direct")
      this.props.navigation.navigate('UserProfile', { userId: currentUser.id })
  }

  renderMessageCell = ({item: messageId, index}) => {
    let { chatType } = this.props
    let prevMessageId = this.props.messagesList[index - 1];
    return <Message messageId={messageId} prevMessageId={prevMessageId} inverted={chatType !== "thread"} />;
  };

  renderLoadingMore = () => {
    let {loading, messagesList} = this.props;
    if (loading && messagesList.length > 1)
      return (
        <View style={{width: '100%', alignItems: 'center'}}>
          <ActivityIndicator size="small" color="#fff" />
        </View>
      );
    return null;
  };

  keyExtractor = (messageId: string) => messageId.toString();

  renderList() {
    let {messagesList, chatType} = this.props;
    return (
      <FlatList
        data={messagesList}
        renderItem={this.renderMessageCell}
        bounces={false}
        initialNumToRender={3}
        inverted={chatType !== 'thread'}
        keyExtractor={this.keyExtractor}
        onEndReachedThreshold={0.5}
        onEndReached={this.getOlderMessages}
        ListFooterComponent={this.renderLoadingMore}
      />
    );
  }

  renderInputToolbar() {
    return <InputToolbar chatId={this.props.currentChat.id} />;
  }

  renderPresense() {
    let {chatType, chatId} = this.props;
    if (chatType === "direct") {
      return <DirectPresense chatId={chatId} />
    }
    return null
  }

  renderMembersCount() {
    let {chatType, chatId} = this.props;
    if (chatType === "channel") {
      return <ChannelMembersCount chatId={chatId} />
    }
    return null
  }

  renderChatName() {
    let {chatType, currentChat, currentUser} = this.props;

    if (chatType === "channel" || chatType === "direct") {
      let chatName =
      chatType === 'channel'
        ? `#${currentChat.name_normalized}`
        : chatType === 'direct'
        ? currentUser.profile.display_name_normalized || currentUser.profile.real_name_normalized
        : 'Thread';
      return <Text style={styles.chatName}>{chatName}</Text>
    }

    return null
  }

  renderHeader() {
    let center = (
      <Touchable onPress={this.openChatDetails} style={{alignItems: 'center'}}>
        {this.renderChatName()}
        {this.renderMembersCount()}
        {this.renderPresense()}
      </Touchable>
    )

    return <Header center={center} left={isLandscape()? undefined : "back"} />
  }

  render() {
    let {theme, currentChat} = this.props;
    if (!currentChat) return null;
    return (
      <SafeAreaView style={[styles.container, {backgroundColor: theme.backgroundColorDarker1}]}>
        {this.renderHeader()}
        {this.renderList()}
        {this.renderInputToolbar()}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  chatName: {
    color: '#fff',
    fontSize: px(15.5),
    fontWeight: 'bold'
  },

  presense: {
    color: '#fff',
    marginTop: px(2.5),
    fontSize: px(13.5)
  }
});

let defaultList = [];
const mapStateToProps = (state: RootState, ownProps) => {
  let chatId = ownProps.chatId ?? ownProps.navigation?.getParam('chatId');
  let threadId = ownProps.threadId ?? ownProps.navigation?.getParam('threadId');
  let chatType = ownProps.chatType ?? ownProps.navigation?.getParam('chatType');

  let currentChat = state.entities.chats.byId[chatId];
  let currentUser = currentChat && state.entities.users.byId[currentChat.user_id];

  let me = meSelector(state);

  let messagesList = state.messages.list[threadId || chatId] || defaultList;

  let lastMessageStatus = state.chats.lastMessages[chatId];

  return {
    chatId,
    threadId,
    currentChat,
    currentUser,
    messagesList,
    nextCursor: state.messages.nextCursor[chatId],
    loading: state.messages.loading[chatId],
    chatType: (chatType ? chatType : currentChat?.is_im ? 'direct' : 'channel') as ChatType,
    lastMessageStatus,
    lastMessage:
      state.entities.messages.byId[
        lastMessageStatus && lastMessageStatus.messageId && lastMessageStatus.messageId
      ],
    me,
    currentTeamToken: currentTeamTokenSelector(state),
  };
};

export default connect(mapStateToProps)(withTheme(withNavigation(ChatUI)));
