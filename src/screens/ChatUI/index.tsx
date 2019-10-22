import React, {Component} from 'react';
import {View, SafeAreaView, StyleSheet, FlatList, ActivityIndicator} from 'react-native';
import {RootState} from '../../reducers';
import {connect, DispatchProp} from 'react-redux';
import Message, {meSelector} from './Message';
import {NavigationInjectedProps} from 'react-navigation';
import {addMessageToChat} from '../../actions/messages';
import {getMessagesByChatId, getRepliesByThreadId} from '../../actions/messages/thunks';
import {markChatAsRead} from '../../actions/chats/thunks';
import Header from '../../components/Header';
import withTheme, {ThemeInjectedProps} from '../../contexts/theme/withTheme';
import InputToolbar from './InputToolbar';
import {getMember} from '../../actions/members/thunks';

type ChatType = 'direct' | 'channel' | 'thread';

type Props = ReturnType<typeof mapStateToProps> &
  NavigationInjectedProps &
  DispatchProp<any> &
  ThemeInjectedProps & {
    chatId: string;
    chatType: ChatType;
  };
class ChatUI extends Component<Props> {
  async componentDidMount() {
    let {chatType} = this.props;
    if (chatType === 'channel' || chatType === 'direct') {
      this.getMessage();
    }

    if (chatType === 'thread') {
      this.getReplies();
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
    } = this.props;
    let chatId = navigation.getParam('chatId');

    if (lastMessageStatus && lastMessageStatus.messageId && !lastMessageStatus.loading) {
      dispatch(addMessageToChat(lastMessageStatus.messageId, chatId));
      dispatch(getMember(lastMessage.user));
    }

    if (nextCursor[chatId] !== 'end' && messagesList.length <= 1) {
      await dispatch(getMessagesByChatId(chatId));
    }

    this.markChatAsRead();
  }

  getReplies() {
    let {navigation, dispatch} = this.props;
    let threadId = navigation.getParam('threadId');
    let chatId = navigation.getParam('chatId');

    dispatch(getRepliesByThreadId(threadId, chatId));
  }

  getOlderMessages = () => {
    let {chatType} = this.props;
    if (chatType === 'channel' || chatType === 'direct') {
      this.props.dispatch(getMessagesByChatId(this.props.navigation.getParam('chatId')));
    }

    if (chatType === 'thread') {
      this.props.dispatch(
        getRepliesByThreadId(
          this.props.navigation.getParam('threadId'),
          this.props.navigation.getParam('chatId'),
        ),
      );
    }
  };

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
  }

  markChatAsRead = () => {
    let {dispatch, navigation} = this.props;
    let chatId = navigation.getParam('chatId');
    dispatch(markChatAsRead(chatId, this.props.messagesList[0]));
  };

  renderMessageCell = ({item: messageId, index}) => {
    let prevMessageId = this.props.messagesList[index - 1];
    return <Message messageId={messageId} prevMessageId={prevMessageId} />;
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
    let {messagesList} = this.props;
    return (
      <FlatList
        data={messagesList}
        renderItem={this.renderMessageCell}
        bounces={false}
        initialNumToRender={3}
        inverted
        keyExtractor={this.keyExtractor}
        onEndReachedThreshold={0.25}
        onEndReached={this.getOlderMessages}
        ListFooterComponent={this.renderLoadingMore}
      />
    );
  }

  renderInputToolbar() {
    return <InputToolbar chatId={this.props.currentChat.id} />;
  }

  render() {
    let {theme, chatType, currentChat, currentUser} = this.props;
    let chatName =
      chatType === 'channel'
        ? `#${currentChat.name_normalized}`
        : chatType === 'direct'
        ? currentUser.profile.display_name_normalized || currentUser.profile.real_name_normalized
        : 'Thread';

    return (
      <SafeAreaView style={[styles.container, {backgroundColor: theme.backgroundColorDarker2}]}>
        <Header center={chatName} left="back" />
        {this.renderList()}
        {this.renderInputToolbar()}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3A1C39',
  },
});

let defaultList = [];
const mapStateToProps = (state: RootState, ownProps) => {
  let chatId = ownProps.navigation.getParam('chatId');
  let threadId = ownProps.navigation.getParam('threadId');
  let chatType = ownProps.navigation.getParam('chatType');

  let currentChat = state.entities.chats.byId[chatId];
  let currentUser = currentChat && state.entities.users.byId[currentChat.user_id];

  let me = meSelector(state);

  let messagesList = state.messages.list[threadId || chatId] || defaultList;

  let lastMessageStatus = state.chats.lastMessages[chatId];

  return {
    chatId,
    currentChat,
    currentUser,
    messagesList,
    nextCursor: state.messages.nextCursor[chatId],
    loading: state.messages.loading[chatId],
    chatType: (chatType ? chatType : currentChat.is_im ? 'direct' : 'channel') as ChatType,
    lastMessageStatus,
    lastMessage:
      state.entities.messages.byId[
        lastMessageStatus && lastMessageStatus.messageId && lastMessageStatus.messageId
      ],
    me,
    currentTeamToken: state.teams.list.find(ws => ws.id === state.teams.currentTeam).token,
  };
};

export default connect(mapStateToProps)(withTheme(ChatUI));
