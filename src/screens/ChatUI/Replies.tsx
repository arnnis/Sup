import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {RootState} from '../../reducers';
import Avatar from '../../components/Avatar';
import {connect, DispatchProp} from 'react-redux';
import px from '../../utils/normalizePixel';
import Touchable from '../../components/Touchable';
import {withNavigation, NavigationInjectedProps} from 'react-navigation';
import withTheme, {ThemeInjectedProps} from '../../contexts/theme/withTheme';
import isLandscape from '../../utils/stylesheet/isLandscape';
import {openBottomSheet} from '../../actions/app';

type Props = ReturnType<typeof mapStateToProps> &
  ThemeInjectedProps &
  DispatchProp<any> &
  NavigationInjectedProps & {
    messageId: string;
  };

class Replies extends Component<Props> {
  handlePress = () => {
    let chatId = this.props.navigation.getParam('chatId');
    let params = {
      chatType: 'thread',
      threadId: this.props.message.ts,
      chatId: chatId || this.props.currentChatId,
    };
    if (isLandscape()) this.props.dispatch(openBottomSheet('ChatUI', params));
    else this.props.navigation.push('ChatUI', params);
  };

  renderParticipantsAvatar() {
    let {message} = this.props;
    return (
      <View style={styles.participantsAvatarContainer}>
        {message.reply_users.slice(0, 4).map(replyUser => (
          <Avatar
            userId={replyUser}
            width={px(20)}
            hideOnlineBadge
            containerStyle={{marginRight: px(2)}}
          />
        ))}
      </View>
    );
  }

  renderRepliesCount() {
    let {message, theme} = this.props;
    return (
      <Text style={[styles.repliesCountText, {color: theme.foregroundColor}]}>
        {message.reply_count} replies
      </Text>
    );
  }

  renderDivider() {
    let {theme} = this.props;
    return <View style={[styles.divider, {backgroundColor: theme.backgroundColorLess4}]} />;
  }

  render() {
    let {message} = this.props;
    if (!message.reply_count || message.reply_count <= 0) return null;
    return (
      <>
        {this.renderDivider()}
        <Touchable style={styles.container} onPress={this.handlePress}>
          {this.renderParticipantsAvatar()}
          {this.renderRepliesCount()}
        </Touchable>
      </>
    );
  }
}

const styles = StyleSheet.create({
  divider: {
    width: '100%',
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#ccc',
    marginTop: px(10),
  },
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: px(7.5),
    paddingBottom: px(3.5),
  },
  participantsAvatarContainer: {
    flexDirection: 'row',
    marginRight: px(5),
  },
  repliesCountText: {
    fontSize: px(13),
  },
});

const mapStateToProps = (state: RootState, ownProps) => ({
  message: state.entities.messages.byId[ownProps.messageId],
  currentChatId: state.chats.currentChatId,
});

export default connect(mapStateToProps)(withNavigation(withTheme(Replies)));
