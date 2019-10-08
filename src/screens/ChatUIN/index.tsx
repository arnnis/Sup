import React, {Component} from 'react';
import {View, SafeAreaView, StyleSheet, FlatList, ActivityIndicator} from 'react-native';
import {RootState} from '../../reducers';
import {connect, DispatchProp} from 'react-redux';
import Message from './Message';
import {NavigationInjectedProps} from 'react-navigation';
import {addMessageToChat} from '../../actions/messages';
import {getMessages} from '../../actions/messages/thunks';
import {markChatAsRead} from '../../actions/chats/thunks';
import Header from '../../components/Header';
import withTheme, {ThemeInjectedProps} from '../../contexts/theme/withTheme';
import InputToolbar from './InputToolbar';
import {getMember} from '../../actions/members/thunks';

type Props = ReturnType<typeof mapStateToProps> &
  NavigationInjectedProps &
  DispatchProp<any> &
  ThemeInjectedProps;

class ChatUI extends Component<Props> {
  async componentDidMount() {
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
      await dispatch(getMessages(chatId));
    }

    this.markChatAsRead();
  }

  getMessages = () => this.props.dispatch(getMessages(this.props.navigation.getParam('chatId')));

  componentDidUpdate(prevProps: Props) {
    let unreadCountIncreased = () => {
      let {currentChat} = this.props;
      let {currentChat: prevChat} = prevProps;
      let isGroup = !currentChat.is_im;

      if (currentChat && prevChat) {
        if (isGroup && currentChat.unread_count && currentChat.unread_count > prevChat.unread_count)
          return true;
        if (!isGroup && currentChat.dm_count && currentChat.dm_count > prevChat.dm_count)
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

  keyExtractor = (messageId: string) => messageId;

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
        onEndReached={this.getMessages}
        ListFooterComponent={this.renderLoadingMore}
      />
    );
  }

  renderInputToolbar() {
    return <InputToolbar chatId={this.props.currentChat.id} />;
  }

  render() {
    let {theme, isGroup, currentChat, currentUser} = this.props;
    let chatName = isGroup
      ? `#${currentChat.name_normalized}`
      : currentUser.profile.display_name_normalized || currentUser.profile.real_name_normalized;

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
  let currentChat = state.entities.chats.byId[chatId];
  let currentUser = currentChat && state.entities.users.byId[currentChat.user_id];

  let me =
    state.entities.users.byId[
      state.teams.list.find(ws => ws.id === state.teams.currentTeam).userId
    ];

  let messagesList = state.messages.list[chatId] || defaultList;
  let pendingMessages = state.messages.pendingMessages[chatId] || defaultList;

  let lastMessageStatus = state.chats.lastMessages[chatId];

  return {
    chatId,
    currentChat,
    currentUser,
    messagesList,
    nextCursor: state.messages.nextCursor[chatId],
    loading: state.messages.loading[chatId],
    isGroup: currentChat && !currentChat.is_im,
    lastMessageStatus,
    lastMessage:
      state.entities.messages.byId[
        lastMessageStatus && lastMessageStatus.messageId && lastMessageStatus.messageId
      ],
    pendingMessages,
    me,
    currentTeamToken: state.teams.list.find(ws => ws.id === state.teams.currentTeam).token,
  };
};

export default connect(mapStateToProps)(withTheme(ChatUI));
