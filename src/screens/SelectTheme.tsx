import React, {FC, useContext} from 'react';
import Screen from '../components/Screen';
import Header from '../components/Header';
import {InfoBox, SwitchRow} from '../components/InfoBox';
import * as themes from '../contexts/theme/themes';
import ThemeContext from '../contexts/theme';
import {ScrollView} from 'react-native';
import useStyle from '../utils/stylesheet/useStyle';
import {ThemeKey} from '../contexts/theme/types';
import {useMediaQuery} from 'react-responsive';

const SelectTheme: FC = () => {
  const {theme, toggleTheme} = useContext(ThemeContext);
  const isLandscape = useMediaQuery({orientation: 'landscape'});

  return (
    <Screen>
      <Header left="back" center="Select Theme" />
      <ScrollView
        contentContainerStyle={[
          {width: '100%'},
          isLandscape && {width: '60%', marginHorizontal: '20%'},
        ]}>
        <InfoBox>
          {Object.keys(themes).map((themeKey: ThemeKey) => {
            let _theme = themes[themeKey];
            return (
              <SwitchRow
                type="tick"
                value={theme.id === themeKey}
                onValueChange={() => toggleTheme(themeKey)}>
                {_theme.displayName}
              </SwitchRow>
            );
          })}
        </InfoBox>
      </ScrollView>
    </Screen>
  );
};

const dynamicStyles = {
  scrollViewContent: {
    width: '100%',
    media: [
      {orientation: 'landscape'},
      {
        width: '60%',
        marginHorizontal: '20%',
      },
    ],
  },
};

export default SelectTheme;
