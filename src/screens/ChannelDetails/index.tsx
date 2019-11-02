import React, {Component} from 'react';
import {Text, StyleSheet, SafeAreaView, View} from 'react-native';
import {InfoBox} from '../../components/InfoBox';
import withTheme, {ThemeInjectedProps} from '../../contexts/theme/withTheme';
import Header from '../../components/Header';
import ChatAvatar from '../DirectsList/ChatAvatar';
import { RootState } from '../../reducers';
import { connect } from 'react-redux';
import px from '../../utils/normalizePixel';
import DirectPresense from '../ChatUI/DirectPresense';
import { getChatType } from '../ChatUI/utils';
import ChannelMembersCount from '../ChatUI/ChannelMembersCount';
import ChannelMembersList from './ChannelMembersList';

type Props = ReturnType<typeof mapStateToProps> & ThemeInjectedProps & {
  chatId?: string
}

class ChatDetails extends Component<Props> {
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
    let {chatType} = this.props;
    return chatType === "channel" && <ChannelMembersCount />
  }

  renderPresense() {
    let {chatType} = this.props;
    return chatType === "direct" && <DirectPresense />
  }

  render() {
    let {theme, chatId} = this.props;
    return (
      <SafeAreaView style={[styles.container, {backgroundColor: theme.backgroundColorDarker1}]}>
        <Header left="back" center="Info" />
        <InfoBox style={{flexDirection: 'row'}}>
          <ChatAvatar chatId={chatId} size={px(67)} />
          <View style={{flex: 1, justifyContent: 'center', paddingLeft: px(15)}}>
            {this.renderChatName()}
            {this.renderPresense()}
            {this.renderMembersCount()}
          </View>
        </InfoBox>
        <InfoBox>
          <ChannelMembersList chatId={chatId} />
        </InfoBox>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  name: {
    fontWeight: '700',
    fontSize: px(15),
  },
});

const mapStateToProps = (state: RootState, ownProps) => {
  let chatId = ownProps.chatId ?? ownProps?.navigation.getParam('chatId')
  let chat = state.entities.chats.byId[chatId]
  let chatType = getChatType(chat)
  let user = chat && chatType === "direct" && state.entities.users.byId[chat.user_id]
  return {
    chatId,
    chat,
    chatType,
    user
  }
}

export default connect(mapStateToProps)(withTheme(ChatDetails)) 
