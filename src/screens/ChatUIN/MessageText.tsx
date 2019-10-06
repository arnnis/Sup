import React, {Component} from 'react';
import {View, StyleSheet, Linking, TextProps, TextStyle} from 'react-native';
import ParsedText from 'react-native-parsed-text';
import {connect} from 'react-redux';
import {RootState} from '../../reducers';
import px from '../../utils/normalizePixel';
import Emoji from './Emoji';
import Username from './Username';

const WWW_URL_PATTERN = /^www\./i;

type Props = ReturnType<typeof mapStateToProps> & {
  messageId: string;
  isMe: boolean;
  textProps: TextProps;
  style: TextStyle;
};

class MessageText extends Component<Props> {
  onUrlPress = url => {
    if (WWW_URL_PATTERN.test(url)) {
      this.onUrlPress(`http://${url}`);
    } else {
      Linking.canOpenURL(url).then(supported => {
        if (!supported) {
          console.error('No handler for URL:', url);
        } else {
          Linking.openURL(url);
        }
      });
    }
  };

  renderUsername(username) {
    username = username
      .replace('@', '')
      .replace('<', '')
      .replace('>', '');
    return <Username userId={username} />;
  }

  renderEmoji(name) {
    name = name.replace(/:/g, '');
    return <Emoji name={name} />;
  }

  render() {
    let {text, isMe, textProps, style} = this.props;
    return (
      <View style={styles.container}>
        <ParsedText
          style={[styles.text, isMe ? styles.textRight : styles.textLeft, style]}
          parse={[
            {type: 'url', style: styles.linkStyle, onPress: this.onUrlPress},
            {
              pattern: RegExp(/<@[A-Z, 0-9]+>/g, 'g'),
              renderText: this.renderUsername,
            },
            {
              pattern: RegExp(/:[A-z, 0-9]+:+/g, 'g'),
              renderText: this.renderEmoji,
            },
          ]}
          {...textProps}>
          {text}
        </ParsedText>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
  text: {
    fontSize: px(15),
  },
  textRight: {
    color: '#fff',
  },
  textLeft: {
    color: '#fff',
  },
  linkStyle: {
    fontSize: px(15),
    lineHeight: px(20),
    marginTop: px(5),
    marginBottom: px(5),
    marginLeft: px(10),
    marginRight: px(10),
  },
});

const mapStateToProps = (state: RootState, ownProps) => ({
  text:
    state.entities.messages.byId[ownProps.messageId] &&
    state.entities.messages.byId[ownProps.messageId].text,
});

export default connect(mapStateToProps)(MessageText);
