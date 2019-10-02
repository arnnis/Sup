/**
 * @format
 */
import React from 'react';
import {AppRegistry} from 'react-native';
import 'react-native-gesture-handler';
import {useScreens} from 'react-native-screens';
import App from './App';
import {name as appName} from './app.json';

if (process.env.NODE_ENV !== 'production') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React);
}

//useScreens();

AppRegistry.registerComponent(appName, () => App);
