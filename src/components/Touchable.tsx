import React, {FC, forwardRef, Ref} from 'react';
import {View, TouchableOpacity, TouchableNativeFeedback, ViewStyle, Platform} from 'react-native';

type Props = {
  style?: Array<ViewStyle> | ViewStyle;
  onPress(): void;
  disabled?: boolean;
};

const Touchable: FC<Props> = forwardRef(({style, onPress, disabled, children}, ref) => {
  let _renderAndroid = () => (
    <TouchableNativeFeedback onPress={onPress} disabled={disabled} ref={ref}>
      <View style={style ? style : null}>{children}</View>
    </TouchableNativeFeedback>
  );

  let _renderIOS = () => (
    <TouchableOpacity style={style ? style : null} onPress={onPress} disabled={disabled}>
      {children}
    </TouchableOpacity>
  );

  return Platform.select({
    android: _renderAndroid(),
    ios: _renderIOS(),
    web: _renderIOS(),
  });
});

export default Touchable;
