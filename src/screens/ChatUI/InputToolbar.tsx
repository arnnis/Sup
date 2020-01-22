import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Keyboard,
  Platform,
  TouchableOpacity,
  MeasureOnSuccessCallback,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import px from '../../utils/normalizePixel';
import Composer from './Composer';
import Send from './Send';
import EmojiPicker from './EmojiPicker';
import {sendMessage} from '../../services/rtm';
import withTheme, {ThemeInjectedProps} from '../../contexts/theme/withTheme';
import isLandscape from '../../utils/stylesheet/isLandscape';
import {EmojiData} from 'emoji-mart';
import isNative from '../../utils/isNative';
import EmojiButton from './EmojiButton';

type Props = ThemeInjectedProps & {
  chatId: string;
  threadId: string;
};

class InputToolbar extends Component<Props> {
  emojiButtonRef: TouchableOpacity;

  state = {
    text: '',
    emojiPicker: {
      open: false,
      standalone: null,
    },
  };

  handleTextChanged = text => this.setState({text});

  handleSendPress = () => {
    sendMessage({
      type: 'message',
      text: this.state.text,
      channel: this.props.chatId,
      thread_ts: this.props.threadId,
    });
    this.setState({text: ''});
  };

  x: Parameters<MeasureOnSuccessCallback>;

  measureEmojiButtonCoord = (): Promise<{px: number; py: number}> =>
    new Promise(resolve => {
      this.emojiButtonRef.measure((x, y, width, height, px, py) => resolve({px, py}));
    });

  handleEmojiButtonPress = async () => {
    if (!this.state.emojiPicker.open) {
      Keyboard.dismiss();
    } else {
      // TODO: focus on input
    }

    if (isLandscape()) {
      let {px, py} = await this.measureEmojiButtonCoord();
      this.setState({
        emojiPicker: {
          ...this.state.emojiPicker,
          open: !this.state.emojiPicker.open,
          standalone: {
            x: px,
            y: py,
          },
        },
      });
    } else {
      this.setState({
        emojiPicker: {
          ...this.state.emojiPicker,
          open: !this.state.emojiPicker.open,
          standalone: null,
        },
      });
    }
  };

  handleEmojiPickerClosed = () =>
    this.setState({emojiPicker: {...this.state.emojiPicker, open: false}});

  handleEmojiPickerOpened = () =>
    this.setState({emojiPicker: {...this.state.emojiPicker, open: true}});

  handleEmojiSelected = (emoji: EmojiData) => {
    this.setState({text: this.state.text + emoji.native});
  };

  renderComposer() {
    return (
      <Composer
        text={this.state.text}
        onTextChanged={this.handleTextChanged}
        isThread={!!this.props.threadId}
      />
    );
  }

  renderSend() {
    return <Send onPress={this.handleSendPress} />;
  }

  renderEmojiButton() {
    return <EmojiButton onEmojiSelected={this.handleEmojiSelected} />;
  }

  render() {
    let {theme} = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <View style={[styles.emojiAndComposeWrapper, {backgroundColor: theme.backgroundColor}]}>
            {this.renderEmojiButton()}
            {this.renderComposer()}
          </View>
          {this.renderSend()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
  wrapper: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: px(5),
    alignItems: 'flex-end',
    paddingBottom: px(7.5),
  },
  emojiButton: {
    borderRadius: px(15),
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: px(10),
    paddingBottom: Platform.select({ios: px(7.5), web: px(7.5), default: px(11)}),
  },
  emojiAndComposeWrapper: {
    backgroundColor: '#333333',
    flexDirection: 'row',
    flex: 1,
    borderRadius: px(20),
    alignItems: 'flex-end',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    elevation: 1,
  },
});

export default withTheme(InputToolbar);
