import React from 'react';
import * as themes from './themes';
import {ThemeName} from './types';

const ThemeContext = React.createContext({
  theme: themes.darkBlueTheme,
  toggleTheme: (themeName: ThemeName) => {},
});

export default ThemeContext;
