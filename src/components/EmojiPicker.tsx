import React, {FC, useContext} from 'react';
import {View, StyleSheet, Platform, Dimensions} from 'react-native';
import {Picker as PickerNative} from 'emoji-mart-native';
import {Picker as PickerWeb, EmojiData} from 'emoji-mart';

import isNative from '../utils/isNative';
import ThemeContext from '../contexts/theme';
import px from '../utils/normalizePixel';
import isLandscape from '../utils/stylesheet/isLandscape';

const dims = Dimensions.get('window');

interface Props {
  onSelect(emoji: EmojiData): void;
}

const EmojiPickerComponent: FC<Props> = ({onSelect}) => {
  const {theme} = useContext(ThemeContext);

  const renderNative = () =>
    isNative() && (
      <PickerNative
        onSelect={onSelect}
        title=""
        emoji=""
        darkMode={theme.isDark}
        native
        emojiSize={px(24)}
        style={{width: dims.width}}
      />
    );

  const renderWeb = () =>
    Platform.OS === 'web' && (
      <PickerWeb
        onSelect={onSelect}
        title="Pick your emoji…"
        emoji="point_up"
        darkMode={theme.isDark}
        showPreview={false}
        showSkinTones={false}
        style={{width: isLandscape() ? px(375) : '100%'}}
      />
    );

  return (
    <View style={styles.container}>
      {renderNative()}
      {renderWeb()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default EmojiPickerComponent;
