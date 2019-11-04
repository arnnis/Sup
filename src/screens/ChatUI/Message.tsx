import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {isSameUser} from './utils';
import {RootState} from '../../reducers';
import Bubble from './Bubble';
import {connect} from 'react-redux';
import Avatar from '../../components/Avatar';
import px from '../../utils/normalizePixel';
import withTheme, {ThemeInjectedProps} from '../../contexts/theme/withTheme';
import {NavigationInjectedProps, withNavigation} from 'react-navigation';
import Day from './Day';
import {meSelector} from '../../reducers/teams';
import rem from '../../utils/stylesheet/rem';
import {ChatType} from '.';

type Props = ReturnType<typeof mapStateToProps> &
  NavigationInjectedProps &
  ThemeInjectedProps & {
    messageId: string;
    prevMessageId: string;
    inverted: boolean;
    showDivider?: boolean;
    hideAvatar?: boolean;
    hideReplies?: boolean;
  };

class Message extends Component<Props> {
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

  render() {
    let {currentMessage, prevMessage, me, inverted} = this.props;
    let sameUser = isSameUser(currentMessage, prevMessage);
    let isMe = me && me.id === currentMessage.user;
    return (
      <>
        {!inverted && this.renderDay()}
        <View
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
  me: meSelector(state),
});

export default connect(mapStateToProps)(withTheme(withNavigation(Message)));
