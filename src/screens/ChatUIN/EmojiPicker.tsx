import React, {useEffect, useState, FC} from 'react';
import {View, StyleSheet, Keyboard} from 'react-native';
import EmojiSelector from 'react-native-emoji-input';
import px from '../../utils/normalizePixel';

interface Props {
  onEmojiSelected(emoji: any): void;
  onClose(): void;
  onOpen(): void;
}

const EmojiPicker: FC<Props> = ({onEmojiSelected, onOpen, onClose}) => {
  let [open, setOpen] = useState(false);

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', handleKeyboardWillShow);
    Keyboard.addListener('keyboardDidHide', handleKeyboardWillHide);
    return () => {
      Keyboard.removeListener('keyboardWillShow', handleKeyboardWillShow);
    };
  }, []);

  const handleKeyboardWillShow = () => {
    setOpen(false);
    onClose();
  };

  const handleKeyboardWillHide = () => {
    setOpen(true);
    onOpen();
  };

  if (!open) return null;

  return (
    <View style={styles.container}>
      <EmojiSelector
        onEmojiSelected={onEmojiSelected}
        keyboardBackgroundColor="#333"
        emojiFontSize={px(25)}
        numColumns={8}
        categoryFontSize={px(23)}
        categoryLabelTextStyle={{color: '#fff', fontSize: px(16)}}
        categoryHighlightColor="#3D2037"
        enableSearch={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: px(300),
  },
});

export default EmojiPicker;
