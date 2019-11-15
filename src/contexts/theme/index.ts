import React from 'react';
import * as themes from './themes';
import {ThemeKey} from './types';

const ThemeContext = React.createContext({
  theme: themes.darkBlueTheme,
  toggleTheme: (themeName: ThemeKey) => {},
});

export default ThemeContext;
