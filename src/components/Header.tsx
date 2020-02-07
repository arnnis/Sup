import React, {Component} from 'react';
import {View, StyleSheet, Text, ViewStyle} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import withTheme, {ThemeInjectedProps} from '../contexts/theme/withTheme';
import px from '../utils/normalizePixel';
import Touchable from './Touchable';
import {NavigationService} from '../navigation/Navigator';

type ButtonsTypes = 'back' | 'menu';

type Props = ThemeInjectedProps & {
  left?: ButtonsTypes | JSX.Element;
  center?: string | JSX.Element;
  right?: ButtonsTypes | JSX.Element;
  statusBarColor?: string;
  style?: ViewStyle;

  onBackPress?(): void;
};

class Header extends Component<Props> {
  renderMenuButton() {
    return (
      <Touchable style={styles.button} onPress={() => {}}>
        <MaterialCommunityIcons name="dots-vertical" color="#fff" size={px(23)} />
      </Touchable>
    );
  }

  renderBackButton() {
    return (
      <Touchable
        style={styles.button}
        onPress={() =>
          this.props.onBackPress ? this.props.onBackPress() : NavigationService.back()
        }>
        <MaterialCommunityIcons name="arrow-left" color="#fff" size={px(22)} />
      </Touchable>
    );
  }

  renderEmptyButton() {
    return <View style={styles.button} />;
  }

  renderButton(type: 'menu' | 'back' | string) {
    if (type === 'menu') return this.renderMenuButton();
    if (type === 'back') return this.renderBackButton();
  }

  renderTitle(title: string) {
    let {theme} = this.props;
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontSize: px(15.5),
            fontWeight: 'bold',
            color: '#fff',
          }}>
          {title}
        </Text>
      </View>
    );
  }

  renderLeft() {
    if (!this.props.left) return this.renderEmptyButton();
    if (typeof this.props.left === 'string') {
      return this.renderButton(this.props.left);
    }
    return this.props.left;
  }

  renderCenter() {
    if (!this.props.center) return this.renderEmptyButton();
    if (typeof this.props.center === 'string') {
      return this.renderTitle(this.props.center);
    }
    return this.props.center;
  }

  renderRight() {
    if (!this.props.right) return this.renderEmptyButton();
    if (typeof this.props.right === 'string') {
      return this.renderButton(this.props.right);
    }
    return this.props.right;
  }

  render() {
    let {theme} = this.props;
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: '#492146',
          },
          this.props.style,
        ]}>
        {this.renderLeft()}
        {this.renderCenter()}
        {this.renderRight()}
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    height: px(55),
    backgroundColor: '#fff',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: px(12.5),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  button: {
    width: px(30),
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default withTheme(Header);
