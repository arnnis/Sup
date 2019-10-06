import React, {Component} from 'react';
import {View, StyleSheet, Text, Keyboard} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import emojis from '../../utils/emoji';
import px from '../../utils/normalizePixel';
import Composer from './Composer';
import Send from './Send';
import EmojiPicker from './EmojiPicker';
import Touchable from '../../components/Touchable';

class InputToolbar extends Component {
  state = {
    text: '',
    emojiSelectorVisible: true,
  };

  handleTextChanged = text => this.setState({text});

  handleSendPress = () => {
    alert('send pressed!');
  };

  handleEmojiButtonPress = () => {
    if (!this.state.emojiSelectorVisible) {
      Keyboard.dismiss();
    } else {
      // TODO: focus on input
    }
    this.setState({emojiSelectorVisible: !this.state.emojiSelectorVisible});
  };

  handleEmojiPickerClosed = () => this.setState({emojiSelectorVisible: false});

  handleEmojiPickerOpened = () => this.setState({emojiSelectorVisible: true});

  handleEmojiSelected = emoji => {
    this.setState({text: this.state.text + emoji.char});
  };

  renderComposer() {
    return <Composer text={this.state.text} onTextChanged={this.handleTextChanged} />;
  }

  renderSend() {
    return <Send onPress={this.handleSendPress} />;
  }

  renderEmojiPicker() {
    if (!this.state.emojiSelectorVisible) return null;
    return (
      <EmojiPicker
        onEmojiSelected={this.handleEmojiSelected}
        onClose={this.handleEmojiPickerClosed}
        onOpen={this.handleEmojiPickerOpened}
      />
    );
  }

  renderEmojiButton() {
    return (
      <Touchable style={styles.emojiButton} onPress={this.handleEmojiButtonPress}>
        <MaterialCommunityIcons
          name="emoticon"
          size={px(21)}
          color="#fff"
          style={{marginTop: px(2.5), marginLeft: px(1)}}
        />
      </Touchable>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <View style={styles.emojiAndComposeWrapper}>
            {this.renderEmojiButton()}
            {this.renderComposer()}
          </View>

          {this.renderSend()}
        </View>
        {this.renderEmojiPicker()}
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
    width: px(31),
    height: px(31),
    borderRadius: px(15),
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: px(5),
    paddingBottom: px(17),
  },
  emojiAndComposeWrapper: {
    backgroundColor: '#333333',
    flexDirection: 'row',
    flex: 1,
    borderRadius: px(20),
    alignItems: 'flex-end',
  },
});

export default InputToolbar;
