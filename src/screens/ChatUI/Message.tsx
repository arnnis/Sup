import React, {Component} from 'react';
import {StyleSheet, View, TouchableWithoutFeedback, Clipboard} from 'react-native';
import ReactDOM from 'react-dom';
import {isSameUser} from './utils';
import {RootState} from '../../reducers';
import Bubble from './Bubble';
import {connect, DispatchProp} from 'react-redux';
import Electron from 'electron';

import Avatar from '../../components/Avatar';
import px from '../../utils/normalizePixel';
import withTheme, {ThemeInjectedProps} from '../../contexts/theme/withTheme';
import {NavigationInjectedProps, withNavigation} from 'react-navigation';
import Day from './Day';
import {meSelector} from '../../reducers/teams';
import rem from '../../utils/stylesheet/rem';
import Reactions from './Reactions';
import {goToThread} from '../../actions/chats/thunks';
import showMenu from '../../utils/showMenu';
import isNative from '../../utils/isNative';
import {Platform} from '../../libs/platform';

type Props = ReturnType<typeof mapStateToProps> &
  NavigationInjectedProps &
  ThemeInjectedProps &
  DispatchProp<any> & {
    messageId: string;
    prevMessageId: string;
    nextMessageId: string;
    inverted: boolean;
    showDivider?: boolean;
    hideAvatar?: boolean;
    hideReplies?: boolean;
  };

class Message extends Component<Props> {
  messageContainerRef: any;

  componentDidMount() {
    Platform.isElectron &&
      ReactDOM.findDOMNode(this).addEventListener('contextmenu', this.handleContextMenuElectron);
  }

  componentWillUnmount() {
    Platform.isElectron &&
      ReactDOM.findDOMNode(this).removeEventListener('contextmenu', this.handleContextMenuElectron);
  }

  goToReplies = () => {
    this.props.dispatch(goToThread(this.props.messageId, this.props.navigation));
  };

  copyTextToClipboard = () => {
    const {currentMessage} = this.props;
    if (Platform.isElectron) {
      Electron.clipboard.writeText(currentMessage.text);
    } else {
      Clipboard.setString(currentMessage.text);
    }
  };

  handleContextMenuElectron = e => {
    e.preventDefault();

    const {Menu, MenuItem} = Electron.remote;

    const menu = new Menu();
    menu.append(
      new MenuItem({
        label: 'Reply',
        click: this.goToReplies,
      }),
    );
    // menu.append(new MenuItem({type: 'separator'}));
    menu.append(new MenuItem({label: 'Copy text'}));

    menu.popup({window: Electron.remote.getCurrentWindow()});
    return false;
  };

  openMessageContextNative = () => {
    if (!isNative()) return;
    showMenu(
      [
        {
          title: 'Reply',
          onPress: this.goToReplies,
        },
        // {
        //   title: 'Edit',
        //   onPress: () => alert('Edit?'),
        // },
      ],
      this.refs['bubble'],
    );
  };

  handleAvatarPress = (userId: string) => {
    this.props.navigation.push('UserProfile', {userId: this.props.currentMessage.user});
  };

  renderAvatar(isMe, sameUser) {
    let {hideAvatar} = this.props;
    if (hideAvatar) return null;
    // If same author of previous message, render a placeholder instead of avatar
    if (sameUser)
      return (
        <View
          style={{width: 35, height: 35, marginLeft: isMe ? 7.5 : 0, marginRight: isMe ? 0 : 7.5}}
        />
      );
    return (
      <Avatar
        userId={this.props.currentMessage.user}
        width={px(35)}
        onPress={this.handleAvatarPress}
      />
    );
  }

  renderBubble(isMe: boolean, sameUser: boolean) {
    return (
      <Bubble
        messageId={this.props.messageId}
        userId={this.props.currentMessage.user}
        pending={this.props.currentMessage.pending}
        isMe={isMe}
        sameUser={sameUser}
        hideReplies={this.props.hideReplies}
        hideAvatar={this.props.hideAvatar}
      />
    );
  }

  renderAnchor(isMe, sameUser) {
    if (sameUser) return null;
    let {theme} = this.props;
    return (
      <View
        style={{
          width: 0,
          height: 0,
          borderTopWidth: 7.5,
          borderTopColor: 'transparent',
          borderBottomColor: isMe ? 'purple' : theme.backgroundColor,
          borderRightWidth: isMe ? 7.5 : 0,
          borderLeftWidth: isMe ? 0 : 7.5,
          borderBottomWidth: 7.5,
          borderRightColor: 'transparent',
          borderLeftColor: 'transparent',
          borderTopLeftRadius: isMe ? 7.5 : 0,
          borderTopRightRadius: isMe ? 0 : 7.5,
        }}
      />
    );
  }

  renderDay() {
    let {currentMessage, prevMessage} = this.props;
    return <Day currentMessage={currentMessage} prevMessage={prevMessage} />;
  }

  renderDivder() {
    if (!this.props.showDivider) return null;
    return (
      <View
        style={{
          width: rem(150),
          marginBottom: px(10),
          height: StyleSheet.hairlineWidth,
          backgroundColor: this.props.theme.backgroundColorLess4,
          alignSelf: 'center',
        }}
      />
    );
  }

  renderReaction() {
    return <Reactions messageId={this.props.messageId} hideAvatar={this.props.hideAvatar} />;
  }

  render() {
    let {currentMessage, prevMessage, nextMessage, me, inverted} = this.props;
    let sameUser = isSameUser(currentMessage, nextMessage);
    let isMe = me && me.id === currentMessage.user;
    return (
      <>
        {!inverted && this.renderDay()}
        {inverted && this.renderReaction()}
        <TouchableWithoutFeedback onLongPress={this.openMessageContextNative}>
          <View
            ref={this.messageContainerRef}
            style={[
              styles.container,
              isMe ? styles.right : styles.left,
              {marginBottom: sameUser ? 4 : 10},
            ]}>
            {!isMe ? (
              <>
                {this.renderAvatar(isMe, sameUser)}
                {this.renderAnchor(isMe, sameUser)}
              </>
            ) : null}
            {this.renderBubble(isMe, sameUser)}
            {isMe && (
              <>
                {this.renderAnchor(isMe, sameUser)}
                {this.renderAvatar(isMe, sameUser)}
              </>
            )}
          </View>
        </TouchableWithoutFeedback>
        {!inverted && this.renderReaction()}
        {this.renderDivder()}
        {inverted && this.renderDay()}
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  left: {
    justifyContent: 'flex-start',
    marginLeft: 8,
    marginRight: 0,
  },
  right: {
    justifyContent: 'flex-end',
    marginLeft: 0,
    marginRight: 8,
  },
});

const mapStateToProps = (state: RootState, ownProps) => ({
  currentMessage: state.entities.messages.byId[ownProps.messageId],
  prevMessage: state.entities.messages.byId[ownProps.prevMessageId],
  nextMessage: state.entities.messages.byId[ownProps.nextMessageId],
  me: meSelector(state),
});

export default connect(mapStateToProps)(withTheme(withNavigation(Message)));
