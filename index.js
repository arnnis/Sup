import React from 'react';
import {AppRegistry} from 'react-native';
import 'react-native-match-media-polyfill';
import 'react-native-gesture-handler';
import {enableScreens} from 'react-native-screens';
import App from './src/App';

const appName = 'Sup';

if (process.env.NODE_ENV !== 'production') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React);
}

enableScreens();

AppRegistry.registerComponent(appName, () => App);
