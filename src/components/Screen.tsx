import React, {FC, useContext} from 'react';
import {SafeAreaView, ViewStyle} from 'react-native';
import ThemeContext from '../contexts/theme';

interface Props {
  style?: ViewStyle;
  transparent?: boolean;
}

const Screen: FC<Props> = ({children, style, transparent}) => {
  const {theme} = useContext(ThemeContext);
  return (
    <>
      <SafeAreaView style={{flex: 0, backgroundColor: '#3A1C39'}} />
      <SafeAreaView
        style={[
          {flex: 1, backgroundColor: theme.backgroundColorDarker1},
          transparent && {backgroundColor: 'transparent'},
          style,
        ]}>
        {children}
      </SafeAreaView>
    </>
  );
};

export default Screen;
