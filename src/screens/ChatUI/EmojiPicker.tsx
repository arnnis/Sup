import React, {useEffect, useState, FC, useContext} from 'react';
import {View, StyleSheet, Keyboard, Dimensions} from 'react-native';
import {Portal, Text} from 'react-native-paper';

import EmojiPickerComponent from '../../components/EmojiPicker';
import px from '../../utils/normalizePixel';
import ThemeContext from '../../contexts/theme';
import {EmojiData} from 'emoji-mart';
import {TouchableWithoutFeedback, TouchableOpacity} from 'react-native-gesture-handler';
import ReactDOM from 'react-dom';

const dims = Dimensions.get('window');

interface Props {
  onEmojiSelected(emoji: EmojiData): void;
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

  const handleKeyboardWillShow = () => {
    onOpen();
    onClose();
  };

  const handleKeyboardWillHide = () => {
    onClose();
    onOpen();
  };

  const renderPicker = () => <EmojiPickerComponent onSelect={onEmojiSelected} />;

  const renderStandalone = () => {
    return (
      <Portal>
        <TouchableOpacity style={[StyleSheet.absoluteFillObject]} onPress={onClose} />
        <View
          style={[
            styles.standaloneContainer,
            {left: standalone.x, bottom: dims.height - standalone.y + 15},
          ]}>
          {renderPicker()}
        </View>
      </Portal>
    );
  };

  const renderNonStandalone = () => <View style={[styles.container]}>{renderPicker()}</View>;

  if (!open) return null;
  const isStandalone = !!standalone;

  return isStandalone ? renderStandalone() : renderNonStandalone();
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  standaloneContainer: {
    flexShrink: 1,
    position: 'absolute',
    borderRadius: px(10),
  },
  standaloneBackgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
});

export default EmojiPicker;
