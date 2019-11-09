import React, {Component} from 'react';
import {Text, StyleSheet, SafeAreaView, View, FlatList} from 'react-native';
import {InfoBox, InfoRow} from '../../components/InfoBox';
import withTheme, {ThemeInjectedProps} from '../../contexts/theme/withTheme';
import Header from '../../components/Header';
import ChatAvatar from '../DirectsList/ChatAvatar';
import { RootState } from '../../reducers';
import { connect, DispatchProp } from 'react-redux';
import px from '../../utils/normalizePixel';
import DirectPresense from '../ChatUI/DirectPresense';
import { getChatType } from '../ChatUI/utils';
import ChannelMembersCount from '../ChatUI/ChannelMembersCount';
import ChannelMemberCell from './ChannelMemberCell';
import { getChannelMembers } from '../../actions/chats/thunks';
import Screen from '../../components/Screen';
import withStylesheet, { StyleSheetInjectedProps } from '../../utils/stylesheet/withStylesheet';

type Props = ReturnType<typeof mapStateToProps> & ThemeInjectedProps & DispatchProp<any> & StyleSheetInjectedProps & {
  chatId?: string
}

class ChatDetails extends Component<Props> {
  componentDidMount() {
    this.getChannelMembers()
  }

  getChannelMembers = () => {
    this.props.dispatch(getChannelMembers(this.props.chatId));
  }
  
  renderChatName() {
    let {chat, chatType, user, theme} = this.props;
    return (
      <Text style={[styles.name, {color: theme.foregroundColor}]}>
        {chatType === "channel"
          ? chat.name
          : user.profile.display_name_normalized || user.profile.real_name_normalized}
      </Text>
    )
  }

  renderMembersCount() {
    let {chatType, chatId} = this.props;
    return chatType === "channel" && <ChannelMembersCount chatId={chatId} />
  }

  renderPresense() {
    let {chatType, chatId} = this.props;
    return chatType === "direct" && <DirectPresense chatId={chatId} />
  }

  renderPurpose() {
    let {chat} = this.props;
    if (!chat?.purpose?.value) return null
    return (
      <InfoBox style={{flexDirection: 'row'}}>
      <InfoRow title="purpose">{chat.purpose.value}</InfoRow>
     </InfoBox>
    )
  }

  renderMemberCell = ({item: memberId, index}) => {
    const isFirst = index === 0
    const isLast = index === this.props.membersList.length - 1
    return <ChannelMemberCell memberId={memberId} isFirst={isFirst} isLast={isLast} />
  }

  renderListHeader = () => {
    let {chatId, chat, theme} = this.props;
    return (
      <>
      <InfoBox style={{flexDirection: 'row'}}>
      <ChatAvatar chatId={chatId} size={px(67)} />
      <View style={{flex: 1, justifyContent: 'center', paddingLeft: px(15)}}>
        {this.renderChatName()}
        {this.renderPresense()}
        {this.renderMembersCount()}
      </View>
     </InfoBox>
      {this.renderPurpose()}
     <Text style={{fontSize: px(12), marginBottom: px(5), color: theme.foregroundColorMuted65, marginLeft: px(40), marginTop: 25}}>{chat?.num_members} MEMBERS</Text>
      </>

    )
  }

  render() {
    let {theme, membersList, dynamicStyles} = this.props;
    return (
        <Screen>
          <Header left="back" center="Channel Info" />
          <FlatList 
            data={membersList}
            renderItem={this.renderMemberCell}
            ListHeaderComponent={this.renderListHeader()}
            onEndReached={this.getChannelMembers}
            onEndReachedThreshold={0.5}
            contentContainerStyle={dynamicStyles.scrollViewContent}
          />
        </Screen>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  name: {
    fontWeight: '700',
    fontSize: px(16),
  },
});

const dynamicStyles = {
  scrollViewContent: {
    width: '100%',
    media: [
      {orientation: 'landscape'},
      {
        width: '60%',
        marginHorizontal: '20%',
      },
    ],
  },
};

const mapStateToProps = (state: RootState, ownProps) => {
  let chatId = ownProps.chatId ?? ownProps?.navigation.getParam('chatId')
  let chat = state.entities.chats.byId[chatId]
  let chatType = getChatType(chat)
  let user = chat && chatType === "direct" && state.entities.users.byId[chat.user_id]
  return {
    chatId,
    chat,
    chatType,
    user,

    membersList: state.chats.membersList[chatId],
    membersListLoading: state.chats.membersListLoadStatus[chatId]?.loading ?? false,
  }
}

export default connect(mapStateToProps)(withTheme(withStylesheet(dynamicStyles)(ChatDetails) )) 
