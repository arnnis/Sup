import React, {Component} from 'react';

import ThemeContext from '.';
import * as themes from './themes';
import {ThemeKey, Theme} from './types';
import {StatusBar, Platform, AsyncStorage} from 'react-native';

interface State {
  themeKey: ThemeKey;
  isLoadingTheme: boolean;
}

class ThemeProvider extends Component<unknown, State> {
  constructor(props) {
    super(props);
    this.state = {
      themeKey: 'lightWhite',
      isLoadingTheme: true,
    };
  }

  async componentDidMount() {
    let themeKey = (await AsyncStorage.getItem('themeKey')) as ThemeKey;
    themeKey && (await this.setState({themeKey}));
    this.setState({isLoadingTheme: false});
    //this.setStatusbar();
    StatusBar.setBackgroundColor('#3A1C39');
  }

  setStatusbar = () => {
    let theme: Theme = themes[this.state.themeKey];
    if (theme.isDark) {
      StatusBar.setBarStyle('dark-content');
      Platform.OS === 'android' && StatusBar.setBackgroundColor('#3A1C39');
    } else {
      StatusBar.setBarStyle('light-content');
      Platform.OS === 'android' && StatusBar.setBackgroundColor('#3A1C39');
    }
  };

  toggleTheme = async (themeKey: ThemeKey) => {
    await this.setState({themeKey});
    AsyncStorage.setItem('themeKey', themeKey);
    //this.setStatusbar();
    StatusBar.setBackgroundColor('#3A1C39');
  };

  render() {
    let {isLoadingTheme} = this.state;
    return (
      <ThemeContext.Provider
        value={{
          theme: themes[this.state.themeKey],
          toggleTheme: this.toggleTheme,
        }}>
        {!isLoadingTheme && this.props.children}
      </ThemeContext.Provider>
    );
  }
}

export default ThemeProvider;
