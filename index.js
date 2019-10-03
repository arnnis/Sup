/**
 * @format
 */
import React from 'react';
import {AppRegistry, Platform} from 'react-native';
import 'react-native-gesture-handler';
import {useScreens} from 'react-native-screens';
import App from './src/App';

const appName = 'Whatslack';

if (process.env.NODE_ENV !== 'production') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React);
}

useScreens();

AppRegistry.registerComponent(appName, () => App);

Platform.OS === 'web' &&
  AppRegistry.runApplication(appName, {
    rootTag: document.getElementById('root'),
  });
