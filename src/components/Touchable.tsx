import React, {FC} from 'react';
import {TouchableNativeFeedback} from 'react-native-gesture-handler';
import {View, TouchableOpacity, ViewStyle, Platform} from 'react-native';

type Props = {
  style?: Array<ViewStyle> | ViewStyle;
  onPress(): void;
  disabled?: boolean;
};

const Touchable: FC<Props> = ({style, onPress, disabled, children}) => {
  let _renderAndroid = ({children}) => (
    <TouchableNativeFeedback onPress={onPress} disabled={disabled}>
      <View style={style ? style : null}>{children}</View>
    </TouchableNativeFeedback>
  );

  let _renderIOS = ({children}) => (
    <TouchableOpacity
      style={style ? style : null}
      onPress={onPress}
      disabled={disabled}>
      {children}
    </TouchableOpacity>
  );

  return Platform.select({
    android: _renderAndroid({children}),
    ios: _renderIOS({children}),
  });
};

export default Touchable;
