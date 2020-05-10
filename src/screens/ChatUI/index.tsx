import React, {Component} from 'react';
import {View, StyleSheet, FlatList, ActivityIndicator, Text, ImageBackground} from 'react-native';
import {connect, DispatchProp} from 'react-redux';
import {NavigationInjectedProps, withNavigation} from 'react-navigation';
import MediaQuery from 'react-responsive';

import Message from './Message';
import {RootState} from '../../reducers';
import {addMessageToChat} from '../../slices/messages-slice';
import {getMessagesByChatId, getRepliesByThreadId} from '../../slices/messages-thunks';
import {markChatAsRead, getChatInfo, goToChannelDetails} from '../../slices/chats-thunks';
import Header from '../../components/Header';
import withTheme, {ThemeInjectedProps} from '../../contexts/theme/withTheme';
import InputToolbar from './InputToolbar';
import {getMember, goToUserProfile} from '../../actions/members/thunks';
import isLandscape from '../../utils/stylesheet/isLandscape';
import {meSelector, currentTeamTokenSelector} from '../../reducers/teams';
import px from '../../utils/normalizePixel';
import Touchable from '../../components/Touchable';
import ChannelMembersCount from './ChannelMembersCount';
import DirectPresense from './DirectPresense';
import Screen from '../../components/Screen';
import Typing from './Typing';
import {setCurrentChat, setCurrentThread} from '../../slices/chats-slice';
import select from '../../utils/select';
import UploadDropZoneWeb from './UploadDropZoneWeb';
import ChannelDetails from '../ChannelDetails';
import ChannelDetailsIcon from '../../assets/icons/dock-right.svg';
import {openUploadDialog} from '../../slices/files-slice';
import {Platform} from '../../utils/platform';

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
  _flatlistRef: any;
  _scrollNode: any;

  state = {
    isChannelDetailsOpen: true,
  };

  async componentDidMount() {
    let {chatType, chatId, dispatch} = this.props;

    if (chatType === 'channel' || chatType === 'direct') {
      this.getMessage();
      dispatch(getChatInfo(chatId));
    }

    if (chatType === 'thread') {
      this.getReplies();
    }

    this.isInverted() && this.registerScrollHandlder();
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

    let chatChanged = this.props.chatId !== prevProps.chatId;
    if (chatChanged) {
      this.componentDidMount();
    }
  }

  componentWillUnmount() {
    let {chatType, dispatch} = this.props;
    if (chatType === 'channel' || chatType === 'direct') {
      dispatch(setCurrentChat({chatId: ''}));
    }

    if (chatType === 'thread') {
      dispatch(setCurrentThread({threadId: ''}));
    }
  }

  // Fixes inverted scroll on web
  registerScrollHandlder() {
    if (Platform.isNative) return;
    this._scrollNode = this._flatlistRef.getScrollableNode();
    this._scrollNode.addEventListener('wheel', this._invertedWheelEvent);

    // enable hardware acceleration
    // makes scrolling fast in safari and firefox
    // https://stackoverflow.com/a/24157294
    this._flatlistRef.setNativeProps({
      style: {
        transform: 'translate3d(0,0,0) scaleY(-1)',
      },
    });
  }

  _invertedWheelEvent = (e) => {
    this._scrollNode.scrollTop -= e.deltaY;
    e.preventDefault();
  };

  async getMessage() {
    let {lastMessageStatus, lastMessage, nextCursor, messagesList, dispatch, chatId} = this.props;
    if (lastMessageStatus && lastMessageStatus.messageId && !lastMessageStatus.loading) {
      dispatch(addMessageToChat({messageId: lastMessageStatus.messageId, chatId}));
      dispatch(getMember(lastMessage.user));
    }

    if (nextCursor && nextCursor[chatId] !== 'end' && messagesList.length <= 1) {
      await dispatch(getMessagesByChatId(chatId));
    }

    this.markChatAsRead();
  }

  getReplies() {
    let {dispatch, threadId, chatId} = this.props;

    dispatch(addMessageToChat({messageId: threadId as string, threadId: threadId as string}));

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
    dispatch(markChatAsRead(chatId, this.props.messagesList[0] as string));
  };

  openChatDetails = () => {
    let {chatId, chatType, currentUser, navigation, dispatch} = this.props;
    if (chatType === 'channel') dispatch(goToChannelDetails(chatId));
    if (chatType === 'direct') dispatch(goToUserProfile(currentUser.id, navigation));
  };

  isInverted = () => this.props.chatType !== 'thread';

  toggleChannelDetailsPanel = () => {
    // if (Platform.isElectron) {
    //   ipcRenderer.send('resize-main-window', {width: 1280});
    // }
    this.setState({isChannelDetailsOpen: !this.state.isChannelDetailsOpen});
  };

  handleFileDropWeb = (files: File[]) => {
    let {chatId, threadId} = this.props;
    this.props.dispatch(openUploadDialog({params: {files, chatId, threadId}}));
  };

  renderMessageCell = ({item: messageId, index}) => {
    let {chatType} = this.props;
    let prevMessageId = this.isInverted()
      ? this.props.messagesList[index + 1]
      : this.props.messagesList[index - 1];
    let nextMessageId = this.isInverted()
      ? this.props.messagesList[index - 1]
      : this.props.messagesList[index + 1];
    let isThreadMainMsg = chatType === 'thread' && index === 0;
    return (
      <Message
        messageId={messageId}
        prevMessageId={prevMessageId}
        nextMessageId={nextMessageId}
        inverted={chatType !== 'thread'}
        showDivider={isThreadMainMsg}
        hideReplies={chatType === 'thread'}
        hideAvatar={chatType === 'direct'}
      />
    );
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
    const inverted = this.isInverted();
    return (
      <FlatList
        ref={(ref) => (this._flatlistRef = ref)}
        data={messagesList}
        renderItem={this.renderMessageCell}
        bounces={false}
        initialNumToRender={6}
        inverted={inverted}
        keyExtractor={this.keyExtractor}
        onEndReachedThreshold={0.5}
        onEndReached={this.getOlderMessages}
        ListFooterComponent={this.renderLoadingMore}
        contentContainerStyle={{
          paddingTop: inverted ? 0 : px(10),
          paddingBottom: inverted ? px(10) : 0,
        }}
      />
    );
  }

  renderInputToolbar() {
    return <InputToolbar chatId={this.props.chatId} threadId={this.props.threadId} />;
  }

  renderPresense() {
    let {chatType, chatId, typingUsersCount} = this.props;
    if (chatType === 'direct' && typingUsersCount === 0) {
      return <DirectPresense chatId={chatId} />;
    }
    return null;
  }

  renderMembersCount() {
    let {chatType, chatId, typingUsersCount, currentChat} = this.props;
    if (chatType === 'channel' && typingUsersCount === 0 && !currentChat.is_private) {
      return <ChannelMembersCount chatId={chatId} />;
    }
    return null;
  }

  renderChatName() {
    let {chatType, currentChat, currentUser} = this.props;

    let chatName = select(chatType, {
      channel: `#${currentChat?.name_normalized}`,
      direct:
        currentUser?.profile.display_name_normalized || currentUser?.profile.real_name_normalized,
      thread: 'Thread',
    });

    return <Text style={styles.chatName}>{chatName}</Text>;
  }

  renderTyping() {
    return <Typing chatId={this.props.chatId} />;
  }

  renderIsPrivate() {
    return <Text style={styles.chat_status}>private</Text>;
  }

  renderHeader() {
    let {chatId, chatType, typingUsersCount, currentChat} = this.props;
    let center = (
      <Touchable onPress={this.openChatDetails} style={{alignItems: 'center'}}>
        {this.renderChatName()}
        {typingUsersCount > 0
          ? this.renderTyping()
          : chatType === 'direct'
          ? this.renderPresense()
          : chatType === 'channel'
          ? currentChat.is_private
            ? this.renderIsPrivate()
            : this.renderMembersCount()
          : null}
      </Touchable>
    );

    let right = chatType === 'channel' && isLandscape() && (
      <Touchable onPress={this.toggleChannelDetailsPanel} style={{marginRight: px(5)}}>
        <ChannelDetailsIcon
          fill={this.state.isChannelDetailsOpen ? '#fff' : '#D3ABD0'}
          width={px(21)}
          height={px(21)}
        />
      </Touchable>
    );

    return <Header center={center} left={isLandscape() ? undefined : 'back'} right={right} />;
  }

  renderChannelDetails() {
    let {chatId, chatType} = this.props;
    let {isChannelDetailsOpen} = this.state;

    return (
      chatType === 'channel' &&
      isChannelDetailsOpen && (
        <MediaQuery minWidth={1280}>
          <View style={{width: px(325)}}>
            <ChannelDetails chatId={chatId} onDismiss={this.toggleChannelDetailsPanel} />
          </View>
        </MediaQuery>
      )
    );
  }

  render() {
    let {currentChat, theme} = this.props;
    if (!currentChat) return null;

    return (
      <Screen>
        <ImageBackground
          style={[styles.container, {backgroundColor: theme.backgroundColorDarker1}]}
          resizeMode="repeat"
          // TODO: change background image feature
          // source={theme.isDark ? undefined : require('../../assets/img/wa1.png')}
        >
          <UploadDropZoneWeb onDrop={this.handleFileDropWeb}>
            {this.renderHeader()}
            {this.renderList()}
            {this.renderInputToolbar()}
          </UploadDropZoneWeb>

          {this.renderChannelDetails()}
        </ImageBackground>
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  chatName: {
    color: '#fff',
    fontSize: px(15.5),
    fontWeight: 'bold',
  },
  chat_status: {
    color: '#fff',
    marginTop: px(2.5),
    fontSize: px(13.5),
  },
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
    typingUsersCount: state.chats.typingsUsers[chatId]?.length ?? 0,
  };
};

export default connect(mapStateToProps)(withTheme(withNavigation(ChatUI)));
