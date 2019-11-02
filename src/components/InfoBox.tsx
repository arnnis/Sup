import React, {useContext, FC} from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import px from '../utils/normalizePixel';
import ThemeContext from '../contexts/theme';

interface Props {
  style?: ViewStyle;
}

export const InfoBox: FC<Props> = ({children, style}) => {
  let {theme} = useContext(ThemeContext);
  return (
    <View style={[styles.container, {backgroundColor: theme.backgroundColor}, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: px(25),
    borderRadius: px(15),
    paddingHorizontal: px(17.5),
    paddingVertical: px(12.5),
    marginTop: px(30),
  },
});
