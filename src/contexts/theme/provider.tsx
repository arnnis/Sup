import React, {Component} from 'react';

import ThemeContext from '.';
import * as themes from './themes';
import {ThemeName, Theme} from './types';
import {StatusBar, Platform} from 'react-native';

interface State {
  themeName: ThemeName;
}

class ThemeProvider extends Component<unknown, State> {
  constructor(props) {
    super(props);
    this.state = {
      themeName: 'darkBlueTheme',
    };
  }

  componentDidMount() {
    let theme: Theme = themes[this.state.themeName];
    if (theme.isDark) {
      StatusBar.setBarStyle('dark-content');
      Platform.OS === 'android' && StatusBar.setBackgroundColor('#3A1C39');
    } else {
      StatusBar.setBarStyle('light-content');
      Platform.OS === 'android' && StatusBar.setBackgroundColor('#3A1C39');
    }
  }

  render() {
    return (
      <ThemeContext.Provider
        value={{
          theme: themes[this.state.themeName],
          toggleTheme: (themeName: ThemeName) => this.setState({themeName}),
        }}>
        {this.props.children}
      </ThemeContext.Provider>
    );
  }
}

export default ThemeProvider;
