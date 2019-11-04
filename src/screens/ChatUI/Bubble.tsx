import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import MessageText from './MessageText';
import px from '../../utils/normalizePixel';
import Name from './Name';
import withTheme, {ThemeInjectedProps} from '../../contexts/theme/withTheme';
import MessageImages from './MessageImages';
import MessageFiles from './MessageFiles';
import MessageVideos from './MessageVideos';
import Replies from './Replies';
import withStylesheet, {StyleSheetInjectedProps} from '../../utils/stylesheet/withStylesheet';
import MessageDate from './MessageDate';
import {ChatType} from '.';

type Props = ThemeInjectedProps &
  StyleSheetInjectedProps & {
    messageId: string;
    userId: string;
    sameUser: boolean;
    isMe: boolean;
    pending: boolean;
    chatType: ChatType;
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
    if (this.props.chatType === 'thread') return null;
    return <Replies messageId={this.props.messageId} />;
  }

  renderSendDate() {
    return <MessageDate messageId={this.props.messageId} />;
  }

  render() {
    let {sameUser, isMe, pending, theme, dynamicStyles} = this.props;

    return (
      <View
        style={[
          styles.container,
          dynamicStyles.container,
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
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          {this.renderName()}
          {this.renderSendDate()}
        </View>

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
    borderRadius: px(5),
    padding: px(5),
    paddingHorizontal: px(7.5),
  },
  right: {
    backgroundColor: 'purple',
  },
});

const dynamicStyles = {
  container: {
    maxWidth: '68%',
    media: [
      {orientation: 'landscape'},
      {
        maxWidth: '62%',
      },
    ],
  },
};

export default withTheme(withStylesheet(dynamicStyles)(Bubble));
