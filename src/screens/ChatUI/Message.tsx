import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {createSelector} from 'reselect';
import {isSameUser} from './utils';
import {RootState} from '../../reducers';
import Bubble from './Bubble';
import {connect} from 'react-redux';
import Avatar from '../../components/Avatar';
import px from '../../utils/normalizePixel';
import withTheme, {ThemeInjectedProps} from '../../contexts/theme/withTheme';
import {NavigationInjectedProps, withNavigation} from 'react-navigation';
import Day from './Day';

type Props = ReturnType<typeof mapStateToProps> &
  NavigationInjectedProps &
  ThemeInjectedProps & {
    messageId: string;
    prevMessageId: string;
  };

class Message extends Component<Props> {
  handleAvatarPress = (userId: string) => {
    this.props.navigation.push('UserProfile', {userId: this.props.currentMessage.user});
  };

  renderAvatar(isMe, sameUser) {
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

  render() {
    let {currentMessage, prevMessage, me} = this.props;
    let sameUser = isSameUser(currentMessage, prevMessage);
    let isMe = me.id === currentMessage.user;
    return (
      <>
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
        {this.renderDay()}
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

export const meSelector = createSelector(
  (state: RootState) => state,
  state =>
    state.entities.users.byId[
      state.teams.list.find(tm => tm.id === state.teams.currentTeam).userId
    ],
);

const mapStateToProps = (state: RootState, ownProps) => ({
  currentMessage: state.entities.messages.byId[ownProps.messageId],
  prevMessage: state.entities.messages.byId[ownProps.prevMessageId],
  me: meSelector(state),
});

export default connect(mapStateToProps)(withTheme(withNavigation(Message)));
