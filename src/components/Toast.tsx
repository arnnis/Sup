import React, {Component} from 'react';
import {View, StyleSheet, Text, Dimensions} from 'react-native';
import Animated from 'react-native-reanimated';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import px from '../utils/normalizePixel';
import withTheme, {ThemeInjectedProps} from '../contexts/theme/withTheme';
import Avatar from './Avatar';
import {RootState} from '../reducers';
import {connect} from 'react-redux';

const dims = Dimensions.get('window');

type Props = ReturnType<typeof mapStateToProps> & ThemeInjectedProps;

class Toast extends Component<Props> {
  progressAnimation = new Animated.Value(0);

  renderTimeoutProgress() {
    return <Animated.View style={styles.progressLine}></Animated.View>;
  }

  renderUser() {
    let {userId} = this.props;
    if (userId) return <Avatar width={px(30)} userId={userId} />;
    return null;
  }

  renderSuccess() {
    let {icon} = this.props;
    if (icon && icon === 'success')
      return <MaterialCommunityIcons size={px(25)} name="check" color="green" />;
    return null;
  }

  renderDismiss() {
    return (
      <View style={{marginLeft: 'auto'}}>
        <MaterialCommunityIcons size={px(22)} name="close" color="#ccc" />
      </View>
    );
  }

  render() {
    let {message} = this.props;
    if (!message) return null;
    return (
      <>
        <View style={styles.container}>
          {this.renderUser()}
          {this.renderSuccess()}
          <Text style={styles.messageText}>This is a sample toast</Text>
          {this.renderDismiss()}
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: px(50),
    left: px(30),
    width: dims.width - px(60),
    height: px(50),
    borderRadius: px(5),
    backgroundColor: '#333',
    alignItems: 'center',
    paddingHorizontal: px(10),
    flexDirection: 'row',
  },
  messageText: {
    color: '#fff',
    marginLeft: px(10),
  },
  progressLine: {
    width: '100%',
    height: px(2),
    backgroundColor: '#ccc',
  },
});

const mapStateToProps = (state: RootState) => state.app.toast;

export default connect(mapStateToProps)(withTheme(Toast));
