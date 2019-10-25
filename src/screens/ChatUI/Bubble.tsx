import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import MessageText from './MessageText';
import px from '../../utils/normalizePixel';
import Name from './Name';
import withTheme, {ThemeInjectedProps} from '../../contexts/theme/withTheme';
import MessageImages from './MessageImages';
import MessageFiles from './MessageFiles';
import MessageVideos from './MessageVideos';
import Replies from './Replies';
import rem from '../../utils/stylesheet/rem';

type Props = ThemeInjectedProps & {
  messageId: string;
  userId: string;
  sameUser: boolean;
  isMe: boolean;
  pending: boolean;
};

class Bubble extends Component<Props> {
  renderMessageText() {
    return <MessageText messageId={this.props.messageId} isMe={this.props.isMe} />;
  }

  renderMessageImages() {
    return <MessageImages messageId={this.props.messageId} />;
  }

  renderMessageVideos() {
    return <MessageVideos messageId={this.props.messageId} />;
  }

  renderMessageFiles() {
    return <MessageFiles messageId={this.props.messageId} />;
  }

  renderName() {
    return <Name userId={this.props.userId} isMe={this.props.isMe} />;
  }

  renderReplies() {
    return <Replies messageId={this.props.messageId} />;
  }

  render() {
    let {sameUser, isMe, pending, theme} = this.props;
    return (
      <View
        style={[
          styles.container,
          {backgroundColor: theme.backgroundColor},
          isMe && styles.right,
          !sameUser && {
            borderBottomLeftRadius: isMe ? 5 : 0,
            borderBottomRightRadius: isMe ? 0 : 5,
          },
          pending && {
            opacity: 0.5,
          },
        ]}>
        {this.renderName()}
        {this.renderMessageText()}
        {this.renderMessageImages()}
        {this.renderMessageVideos()}
        {this.renderMessageFiles()}
        {this.renderReplies()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    maxWidth: rem(250),
    borderRadius: px(5),
    padding: px(5),
    paddingHorizontal: px(7.5),
  },
  right: {
    backgroundColor: 'purple',
  },
});

export default withTheme(Bubble);
