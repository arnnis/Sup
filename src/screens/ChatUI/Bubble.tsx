import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import {Message} from '../../models';
import MessageText from './MessageText';
import px from '../../utils/normalizePixel';
import Name from './Name';
import withTheme, {ThemeInjectedProps} from '../../contexts/theme/withTheme';
import MessageImage from './MessageImage';
import MessageFilesList from './MessageFile';

type Props = ThemeInjectedProps & {
  currentMessage: Message;
  sameUser: boolean;
  isMe: boolean;
};

class Bubble extends Component<Props> {
  renderMessageText() {
    return <MessageText messageId={this.props.currentMessage.ts} isMe={this.props.isMe} />;
  }

  renderMessageImages() {
    return <MessageImage messageId={this.props.currentMessage.ts} />;
  }

  renderMessageFiles() {
    return <MessageFilesList messageId={this.props.currentMessage.ts} />;
  }

  renderName() {
    return <Name userId={this.props.currentMessage.user} />;
  }

  render() {
    let {sameUser, isMe, theme} = this.props;
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
        ]}>
        {this.renderName()}

        {this.renderMessageText()}
        {this.renderMessageImages()}
        {this.renderMessageFiles()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    maxWidth: px(250),
    borderRadius: px(5),
    padding: px(5),
    paddingHorizontal: px(7.5),
  },
  right: {
    backgroundColor: 'purple',
  },
});

export default withTheme(Bubble);
