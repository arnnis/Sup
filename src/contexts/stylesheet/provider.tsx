import React, {Component} from 'react';

import StyleContext from '.';
import {ViewStyle, Platform, Dimensions} from 'react-native';

class ThemeProvider extends Component<unknown> {
  getOrientation = () => {
    if (Dimensions.get('window').width > Dimensions.get('window').height) {
      return 'landscape';
    }
    return 'portrait';
  };

  handlePlatformMedia = (mediaProperty, style) => {
    if (
      (mediaProperty.includes('android') && Platform.OS === 'android') ||
      (mediaProperty.includes('ios') && Platform.OS === 'ios') ||
      (mediaProperty.includes('web') && Platform.OS === 'web')
    ) {
      return {
        ...style,
        ...style[mediaProperty],
      };
    }
    return style;
  };

  handleOrientationMedia = (mediaProperty, style) => {
    if (
      (mediaProperty.includes('landscape') && this.getOrientation() === 'landscape') ||
      (mediaProperty.includes('portrait') && this.getOrientation() === 'portrait')
    ) {
      return {
        ...style,
        ...style[mediaProperty],
      };
    }
    return style;
  };

  handleUIModeMedia = (mediaProperty, style) => {
    if (
      (mediaProperty.includes('whatslack') && this.getOrientation() === 'landscape') ||
      (mediaProperty.includes('dislack') && this.getOrientation() === 'portrait')
    ) {
      return {
        ...style,
        ...style[mediaProperty],
      };
    }
    return style;
  };

  createStylesheet = (stylesheet: ViewStyle) => {
    const outputStylesheet = {};
    for (let stylesName in stylesheet) {
      let styleObject = stylesheet[stylesName];
      for (let property in styleObject) {
        if (property.startsWith('@media')) {
          outputStylesheet[stylesName] = this.handlePlatformMedia(property, styleObject);
          outputStylesheet[stylesName] = this.handleOrientationMedia(property, styleObject);
          delete styleObject[property];
        }
      }
    }
  };

  render() {
    return (
      <StyleContext.Provider
        value={{
          stylesheet: this.createStylesheet,
        }}>
        {this.props.children}
      </StyleContext.Provider>
    );
  }
}

export default ThemeProvider;
