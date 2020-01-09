import React, {useEffect, useState, FC, useContext} from 'react';
import {View, StyleSheet, Keyboard, Dimensions} from 'react-native';
import EmojiSelector from 'react-native-emoji-input';
import px from '../../utils/normalizePixel';
import rem from '../../utils/stylesheet/rem';
import ThemeContext from '../../contexts/theme';

const dims = Dimensions.get('window');

interface Props {
  onEmojiSelected(emoji: any): void;
  open: boolean;
  onClose(): void;
  onOpen(): void;
  standalone?: {
    x: number;
    y: number;
  };
}

const EmojiPicker: FC<Props> = ({onEmojiSelected, open, onOpen, onClose, standalone}) => {
  const {theme} = useContext(ThemeContext);
  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', handleKeyboardWillShow);
    Keyboard.addListener('keyboardDidHide', handleKeyboardWillHide);
    return () => {
      Keyboard.removeListener('keyboardWillShow', handleKeyboardWillShow);
    };
  }, []);

  useEffect(() => {
    //alert(JSON.stringify(standalone));
  }, [standalone]);

  const handleKeyboardWillShow = () => {
    onOpen();
    onClose();
  };

  const handleKeyboardWillHide = () => {
    onClose();
    onOpen();
  };

  if (!open) return null;

  return (
    <View style={[styles.standaloneContainer, {left: 15, bottom: dims.height - standalone.y + 20}]}>
      <EmojiSelector
        onEmojiSelected={onEmojiSelected}
        keyboardBackgroundColor={theme.backgroundColor}
        emojiFontSize={px(25)}
        numColumns={20}
        categoryFontSize={px(23)}
        categoryLabelTextStyle={{color: theme.foregroundColor, fontSize: px(16)}}
        categoryHighlightColor="#3D2037"
        enableSearch={false}
        width={rem(915)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: px(300),
  },
  standaloneContainer: {
    height: px(300),
    position: 'absolute',
    borderRadius: px(10),
  },
});

export default EmojiPicker;
