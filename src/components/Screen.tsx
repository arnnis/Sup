import React, {FC} from 'react';
import {SafeAreaView} from 'react-native';
import withTheme, {ThemeInjectedProps} from '../contexts/theme/withTheme';

const Screen: FC<ThemeInjectedProps> = ({children, theme}) => (
  <>
    <SafeAreaView style={{flex: 0, backgroundColor: '#3A1C39'}} />
    <SafeAreaView style={{flex: 1, backgroundColor: theme.backgroundColorDarker1}}>
      {children}
    </SafeAreaView>
  </>
);

export default withTheme(Screen);
