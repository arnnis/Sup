import * as React from 'react';
import {View, StyleSheet, ViewStyle, StyleProp, TouchableOpacity, Text} from 'react-native';
import withTheme, {ThemeInjectedProps} from '../../contexts/theme/withTheme';

type Props = ThemeInjectedProps & {
  /**
   * Title text for the `MenuItem`.
   */
  title: React.ReactNode;
  /**
   * Icon to display for the `MenuItem`.
   */
  icon?: any;
  /**
   * Whether the 'item' is disabled. A disabled 'item' is greyed out and `onPress` is not called on touch.
   */
  disabled?: boolean;
  /**
   * Function to execute on press.
   */
  onPress?: () => void;
  /**
   * @optional
   */
  style?: StyleProp<ViewStyle>;
  /**
   * TestID used for testing purposes
   */
  testID?: string;
};

/**
 * A component to show a single list item inside a Menu.
 *
 */

class MenuItem extends React.Component<Props> {
  static displayName = 'Menu.Item';

  render() {
    const {icon, title, disabled, onPress, theme, style, testID} = this.props;

    const disabledColor = theme.foregroundColorMuted65;

    const titleColor = disabled ? disabledColor : theme.foregroundColor;

    const iconColor = disabled ? disabledColor : theme.foregroundColor;

    return (
      <TouchableOpacity
        style={[styles.container, {backgroundColor: theme.backgroundColor}, style]}
        onPress={onPress}
        disabled={disabled}
        testID={testID}>
        <View style={styles.row}>
          {icon ? (
            <View style={[styles.item, styles.icon]} pointerEvents="box-none">
              {icon}
            </View>
          ) : null}
          <View
            style={[styles.item, styles.content, icon ? styles.widthWithIcon : null]}
            pointerEvents="none">
            <Text numberOfLines={1} style={[styles.title, {color: titleColor}]}>
              {title}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const minWidth = 112;
const maxWidth = 280;
const iconWidth = 40;

const styles = StyleSheet.create({
  container: {
    padding: 4,
    minWidth,
    maxWidth,
  },
  row: {
    flexDirection: 'row',
  },
  icon: {
    width: iconWidth,
  },
  title: {
    fontSize: 15,
  },
  item: {
    margin: 8,
  },
  content: {
    justifyContent: 'center',
    minWidth: minWidth - 16,
    maxWidth: maxWidth - 16,
  },
  widthWithIcon: {
    maxWidth: maxWidth - (iconWidth + 48),
  },
});

export default withTheme(MenuItem);

// @component-docs ignore-next-line
export {MenuItem};
