import React, {FC, useContext} from 'react';
import Screen from '../components/Screen';
import Header from '../components/Header';
import {InfoBox, SwitchRow} from '../components/InfoBox';
import * as themes from '../contexts/theme/themes';
import ThemeContext from '../contexts/theme';

const SelectTheme: FC = () => {
  let {theme, toggleTheme} = useContext(ThemeContext);
  return (
    <Screen>
      <Header left="back" center="Select Theme" />
      <InfoBox>
        {Object.keys(themes).map(themeKey => {
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
    </Screen>
  );
};

export default SelectTheme;
