import React, {Component, PureComponent} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {RootState} from '../../reducers';
import Avatar from '../../components/Avatar';
import {connect, DispatchProp} from 'react-redux';
import px from '../../utils/normalizePixel';
import Touchable from '../../components/Touchable';
import {withNavigation, NavigationInjectedProps} from 'react-navigation';
import withTheme, {ThemeInjectedProps} from '../../contexts/theme/withTheme';
import {goToThread} from '../../actions/chats/thunks';

type Props = ReturnType<typeof mapStateToProps> &
  ThemeInjectedProps &
  DispatchProp<any> &
  NavigationInjectedProps & {
    messageId: string;
    isMe: boolean;
  };

class Replies extends PureComponent<Props> {
  handlePress = () => {
    this.props.dispatch(goToThread(this.props.message.ts, this.props.navigation));
  };

  renderParticipantsAvatar() {
    let {message} = this.props;
    return (
      <View style={styles.participantsAvatarContainer} pointerEvents="box-only">
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
    let {message, isMe, theme} = this.props;
    return (
      <Text style={[styles.repliesCountText, {color: isMe ? '#fff' : theme.foregroundColor}]}>
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
