import React, {useContext, useState, FC} from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import {EmojiData} from 'emoji-mart';

import px from '../../utils/normalizePixel';
import Composer from './Composer';
import Send from './Send';
import * as RTM from '../../services/rtm';
import EmojiButton from './EmojiButton';
import ThemeContext from '../../contexts/theme';

type Props = {
  chatId: string;
  threadId: string;
};

const InputToolbar: FC<Props> = ({chatId, threadId}) => {
  const [text, setText] = useState('');
  const {theme} = useContext(ThemeContext);

  const handleTextChanged = text => setText(text);

  const handleSendPress = () => {
    RTM.sendMessage({
      type: 'message',
      text,
      channel: chatId,
      thread_ts: threadId,
    });
    setText('');
  };

  const handleEmojiSelected = (emoji: EmojiData) => setText(text + emoji.native);

  const renderComposer = () => (
    <Composer text={text} onTextChanged={handleTextChanged} isThread={!!threadId} />
  );

  const renderSend = () => <Send onPress={handleSendPress} />;

  const renderEmojiButton = () => <EmojiButton onEmojiSelected={handleEmojiSelected} />;

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <View style={[styles.emojiAndComposeWrapper, {backgroundColor: theme.backgroundColor}]}>
          {renderEmojiButton()}
          {renderComposer()}
        </View>
        {renderSend()}
      </View>
    </View>
  );
};

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

export default InputToolbar;
