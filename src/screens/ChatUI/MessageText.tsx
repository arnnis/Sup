import React, {Component} from 'react';
import {View, Text, StyleSheet, Linking, TextProps, TextStyle} from 'react-native';
import ParsedText from 'react-native-parsed-text';
import {connect} from 'react-redux';
import {RootState} from '../../reducers';
import px from '../../utils/normalizePixel';
import Emoji from './Emoji';
import Username from './Username';
import Code from './Code';
import withTheme, {ThemeInjectedProps} from '../../contexts/theme/withTheme';

const WWW_URL_PATTERN = /^www\./i;
const USERNAME_PATTERN = /\<@(.*?)\>/i;
const EMOJI_PATTREN = /:[A-z, 0-9]+:+/i;
const CODE_PATTERN = /\```(.*?)\```/i;
const LINK_PATTERN = /<([^<>]+)>/i;

type Props = ReturnType<typeof mapStateToProps> &
  ThemeInjectedProps & {
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

  renderCode(text: string) {
    text = text.replace(/```/g, '');
    return <Code text={text} />;
  }

  renderLink(text) {
    let display, content;
    text.replace(/<([^<>]+)>/g, (_, p1) => {
      let [d, c] = p1.split('|');
      display = d;
      content = c;
    });
    return (
      <Text style={{textDecorationLine: 'underline'}} onPress={() => this.onUrlPress(content)}>
        {display}
      </Text>
    );
  }

  render() {
    let {text, filesCount, isMe, textProps, style, theme} = this.props;
    // if (!text) {
    //   if (filesCount && filesCount > 0)
    //     text = 'File'
    // }

    return (
      <View style={styles.container}>
        <ParsedText
          style={[
            styles.text,
            isMe ? styles.textRight : styles.textLeft,
            {color: isMe ? '#fff' : theme.foregroundColor},
            style,
          ]}
          parse={[
            {
              pattern: USERNAME_PATTERN,
              renderText: this.renderUsername,
            },
            {
              pattern: EMOJI_PATTREN,
              renderText: this.renderEmoji,
            },
            {
              pattern: CODE_PATTERN,
              renderText: this.renderCode,
            },
            {
              pattern: LINK_PATTERN,
              renderText: this.renderLink,
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
    state.entities.messages.byId[ownProps.messageId]?.text,
  filesCount: state.entities.messages.byId[ownProps.messageId]?.files?.length
});

export default connect(mapStateToProps)(withTheme(MessageText));
