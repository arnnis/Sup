import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  StatusBar,
  Dimensions,
} from 'react-native';
import Svg, {Defs, Path, Stop, LinearGradient} from 'react-native-svg';
import {DispatchProp, connect} from 'react-redux';

import px from '../../utils/normalizePixel';
import {signinTeam} from '../../actions/teams/thunks';
import withTheme, {ThemeInjectedProps} from '../../contexts/theme/withTheme';
import rem from '../../utils/stylesheet/rem';
import Touchable from '../../components/Touchable';
import Header from '../../components/Header';
import Screen from '../../components/Screen';
import withStylesheet, {StyleSheetInjectedProps} from '../../utils/stylesheet/withStylesheet';
import isLandscape from '../../utils/stylesheet/isLandscape';

type Props = ThemeInjectedProps & StyleSheetInjectedProps & DispatchProp<any>;

const dims = Dimensions.get('window');

class Auth extends Component<Props> {
  state = {
    domain: '',
    email: '',
    password: '',
    pin: '',
    loggingIn: false,
  };

  renderTop() {
    return (
      <View
        style={{
          height: rem(135),
          width: '100%',
          backgroundColor: '#492146',
        }}>
        <View style={{...StyleSheet.absoluteFillObject, top: rem(10), alignItems: 'center'}}>
          <Text style={styles.appTitle}>Sup</Text>
          <Text style={styles.authMode}>signin</Text>
        </View>
      </View>
    );
  }

  renderInput(key: string, title: string, placeholder: string, onChange: any, secure?: boolean) {
    let {theme} = this.props;
    return (
      <View style={{width: '85%', marginBottom: px(12.5)}}>
        <Text
          style={{
            marginBottom: px(7.5),
            color: theme.foregroundColor,
            fontSize: px(13.5),
          }}>
          {title}
        </Text>
        <TextInput
          style={{
            width: '100%',
            height: px(45),
            backgroundColor: theme.backgroundColorLess2,
            padding: px(10),
            borderRadius: px(5),
            color: theme.foregroundColor,
          }}
          value={this.state[key]}
          placeholderTextColor={theme.backgroundColorLess4}
          onChangeText={onChange}
          placeholder={placeholder || ''}
          secureTextEntry={secure ? secure : false}
          onChange={text => this.setState({[key]: text})}
        />
      </View>
    );
  }

  renderDivider() {
    let {theme} = this.props;
    return (
      <View
        style={{
          width: '40%',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: px(20),
          marginBottom: px(10),
          height: StyleSheet.hairlineWidth,
          backgroundColor: theme.backgroundColorLess2,
        }}
      />
    );
  }

  renderDomainInput() {
    let {theme} = this.props;
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
          marginTop: px(20),
        }}>
        <View style={{width: isLandscape() ? '55%' : '40%'}}>
          <TextInput
            style={{
              width: '100%',
              height: px(41),
              backgroundColor: theme.backgroundColorLess2,
              padding: px(10),
              borderRadius: px(5),
              color: theme.foregroundColor,
              textAlignVertical: 'bottom',
            }}
            value={this.state.domain}
            placeholderTextColor={theme.backgroundColorLess4}
            onChangeText={text => this.setState({domain: text})}
            placeholder="Team"
          />
        </View>
        <Text
          style={{
            color: theme.foregroundColor,
            fontWeight: 'bold',
            marginLeft: px(10),
            fontSize: px(16),
            marginBottom: px(2.5),
          }}>
          .slack.com
        </Text>
      </View>
    );
  }

  renderSubmitButton() {
    return (
      <TouchableOpacity
        style={styles.submitButton}
        disabled={this.state.loggingIn}
        onPress={async () => {
          try {
            this.setState({loggingIn: true});
            await this.props.dispatch(
              signinTeam(
                this.state.domain.toLowerCase(),
                this.state.email.toLowerCase(),
                this.state.password,
                this.state.pin.toLowerCase(),
              ),
            );
          } catch (err) {
            console.log(err);
          } finally {
            this.setState({loggingIn: false});
          }
        }}>
        {this.state.loggingIn ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.submitButtonTitle}>Sign In</Text>
        )}
      </TouchableOpacity>
    );
  }

  renderSigninToPlayground() {
    let {theme, dispatch} = this.props;
    return (
      <Touchable
        onPress={() => {
          this.setState({
            domain: 'supplayground',
            email: 'arnnnnis@gmail.com',
            password: 'abc123456',
          });
        }}
        style={{
          width: px(175),
          borderRadius: px(10),
          borderWidth: px(1),
          padding: px(2.5),
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: px(15),
          borderColor: theme.foregroundColorTransparent10,
        }}>
        <Text style={{color: theme.foregroundColor}}>fill with sample team</Text>
      </Touchable>
    );
  }

  renderHeader() {
    const left = !isLandscape() ? 'back' : null;

    return (
      <Header
        left={left}
        style={{elevation: 0, shadowOffset: {width: 0, height: 0}, shadowColor: 'transparent'}}
      />
    );
  }

  render() {
    let {theme} = this.props;
    return (
      <Screen>
        <StatusBar backgroundColor="#492146" animated />
        {this.renderHeader()}

        <ScrollView bounces={false} style={{flex: 1, backgroundColor: theme.backgroundColor}}>
          <KeyboardAvoidingView
            style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
            {this.renderTop()}
            {this.renderDomainInput()}
            {this.renderDivider()}
            {this.renderInput('email', 'Email', 'Enter your email', (email: string) =>
              this.setState({email}),
            )}
            {this.renderInput(
              'password',
              'Password',
              'Enter your password',
              (password: string) => this.setState({password}),
              true,
            )}
            {this.renderInput(
              'pin',
              '2FA Pin (if enabled)',
              'Enter your 2fa pin',
              (pin: string) => this.setState({pin}),
              true,
            )}
            {this.renderSubmitButton()}
            {this.renderSigninToPlayground()}
          </KeyboardAvoidingView>
        </ScrollView>
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  headerContainer: {
    width: '100%',
    height: px(150),
    justifyContent: 'center',
    alignItems: 'center',
  },
  appTitle: {
    color: '#fff',
    fontSize: rem(29),
    // fontFamily: 'Skia',
    fontWeight: 'bold',
  },
  authMode: {
    color: '#fff',
    fontSize: rem(16),
    marginTop: px(5),
    fontWeight: '500',
    marginBottom: px(12.5),
  },
  submitButton: {
    backgroundColor: '#274dbe',
    width: px(220),
    height: px(45),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: px(15),
    borderRadius: px(5),
  },
  submitButtonTitle: {
    color: '#fff',
  },
});

const dynamicStyles = {
  scrollView: {
    width: '100%',
    media: [{orientation: 'landscape'}, {width: '60%', marginHorizontal: '20%'}],
  },
};

export default connect()(withTheme(withStylesheet(dynamicStyles)(Auth)));
