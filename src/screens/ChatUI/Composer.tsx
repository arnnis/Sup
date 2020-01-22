import React, {Component} from 'react';
import {Platform, StyleSheet, TextInput} from 'react-native';
import px from '../../utils/normalizePixel';
import withTheme, {ThemeInjectedProps} from '../../contexts/theme/withTheme';

type Props = ThemeInjectedProps & {
  text: string;
  onTextChanged(text: string): void;
  isThread?: boolean;
};

class Composer extends Component<Props> {
  contentSize?: {width: number; height: number} = undefined;

  onContentSizeChange = (e: any) => {
    const {contentSize} = e.nativeEvent;

    // Support earlier versions of React Native on Android.
    if (!contentSize) {
      return;
    }

    if (
      !this.contentSize ||
      (this.contentSize &&
        (this.contentSize.width !== contentSize.width ||
          this.contentSize.height !== contentSize.height))
    ) {
      this.contentSize = contentSize;
    }
  };

  onChangeText = (text: string) => {
    this.props.onTextChanged!(text);
  };

  render() {
    const {isThread, theme} = this.props;
    const placeholder = `Type a ${isThread ? 'reply' : 'message'}...`;
    return (
      <TextInput
        accessible
        accessibilityLabel={placeholder}
        placeholder={placeholder}
        placeholderTextColor={theme.foregroundColorMuted40}
        multiline
        onChange={this.onContentSizeChange}
        onContentSizeChange={this.onContentSizeChange}
        onChangeText={this.onChangeText}
        style={[
          styles.textInput,
          {
            ...Platform.select({
              web: {
                outlineWidth: 0,
                outlineColor: 'transparent',
                outlineOffset: 0,
              },
            }),
          },
          {color: theme.foregroundColor},
        ]}
        autoFocus={false}
        value={this.props.text}
        enablesReturnKeyAutomatically
        underlineColorAndroid="transparent"
        keyboardAppearance="default"
      />
    );
  }
}

const styles = StyleSheet.create({
  textInput: {
    color: '#fff',
    flex: 1,
    marginLeft: px(10),
    fontSize: px(15),
    lineHeight: Platform.select({ios: px(21), default: px(24)}),
    textAlignVertical: 'center',
    minHeight: px(40),
    ...Platform.select({
      web: {
        paddingTop: px(6),
        paddingLeft: px(4),
      },
    }),
  },
});

export default withTheme(Composer);
