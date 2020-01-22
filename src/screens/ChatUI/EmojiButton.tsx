import React, {useRef, useContext, useState, FC} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {StyleSheet, TouchableOpacity, Keyboard} from 'react-native';
import {EmojiData} from 'emoji-mart';

import EmojiPicker from './EmojiPicker';
import px from '../../utils/normalizePixel';
import {Platform} from '../../utils/platform';
import ThemeContext from '../../contexts/theme';
import isLandscape from '../../utils/stylesheet/isLandscape';

interface Props {
  onEmojiSelected(emoji: EmojiData): void;
}

const EmojiButton: FC<Props> = ({onEmojiSelected}) => {
  const [open, setOpen] = useState(false);
  const [coord, setCoord] = useState<{x: number; y: number}>(null);
  const ref = useRef<TouchableOpacity>(null);
  const {theme} = useContext(ThemeContext);

  const measureCoord = (): Promise<{px: number; py: number}> =>
    new Promise(resolve => {
      ref.current.measure((x, y, w, h, px, py) => resolve({px, py}));
    });

  const handleEmojiButtonPress = async () => {
    if (!open) {
      Keyboard.dismiss();
    } else {
      // TODO: focus on input
    }

    if (isLandscape()) {
      let {px, py} = await measureCoord();
      setCoord({x: px, y: py});
      setOpen(!open);
    } else {
      setOpen(!open);
    }
  };

  const handleEmojiPickerClosed = () => setOpen(false);

  const handleEmojiPickerOpened = () => setOpen(true);

  return (
    <>
      <TouchableOpacity
        style={styles.emojiButton}
        onPressIn={Platform.isNative && handleEmojiButtonPress}
        // @ts-ignore
        onMouseEnter={handleEmojiButtonPress}
        ref={ref}>
        <MaterialCommunityIcons
          name="emoticon"
          size={px(21)}
          color={theme.foregroundColorMuted65}
          style={{marginTop: px(2.5), marginLeft: px(1)}}
        />
      </TouchableOpacity>
      <EmojiPicker
        onEmojiSelected={onEmojiSelected}
        onClose={handleEmojiPickerClosed}
        onOpen={handleEmojiPickerOpened}
        open={open}
        standalone={coord}
      />
    </>
  );
};

const styles = StyleSheet.create({
  emojiButton: {
    borderRadius: px(15),
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: px(10),
    paddingBottom: Platform.select({ios: px(7.5), web: px(7.5), default: px(11)}),
  },
});

export default EmojiButton;
