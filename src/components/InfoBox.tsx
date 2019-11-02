import React, {useContext, FC} from 'react';
import {View, StyleSheet, ViewStyle, Text} from 'react-native';
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

interface InfoRowProps {
  title: string;
}

export const InfoRow: FC<InfoRowProps> = ({title, children}) => {
  let {theme} = useContext(ThemeContext);
  return (
    <View>
      <Text style={styles.infoTitle}>{title}</Text>
      <Text style={[styles.infoBody, {color: theme.foregroundColor}]}>{children}</Text>
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
  infoTitle: {
    color: '#A652A3',
  },
  infoBody: {
    marginTop: px(5),
  },
});
