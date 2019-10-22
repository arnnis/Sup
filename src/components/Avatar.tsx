import React, {Component} from 'react';
import {View, Text, StyleSheet, ViewStyle, TouchableOpacity} from 'react-native';
import px from '../utils/normalizePixel';
import FastImage from 'react-native-fast-image';
import {connect} from 'react-redux';
import {RootState} from '../reducers';
import {currentTeamTokenSelector} from '../screens/ChatUI/MessageImages';

type Props = ReturnType<typeof mapStateToProps> & {
  userId: string;
  width?: number;
  style?: ViewStyle;
  onPress?(): void;
  containerStyle?: ViewStyle;
  hideOnlineBadge: boolean;
};

class Avatar extends Component<Props> {
  static defaultProps = {
    width: px(50),
  };

  state = {
    errored: false,
  };

  onError = () => this.setState({errored: true});

  renderImage() {
    let {user, width} = this.props;

    if (!user) return <View style={styles.image} />;

    let {profile} = user;
    let uri = '';

    switch (true) {
      case width < 32:
        uri = profile.image_24;
        break;
      case width < 72:
        uri = profile.image_48;
      case width < 192:
        uri = profile.image_72;
        break;
      case width < 512:
        uri = profile.image_192;
        break;
      default:
        uri = profile.image_512;
    }

    return (
      <FastImage
        source={{uri, headers: {Authorization: 'Bearer ' + this.props.token}}}
        style={[styles.image, {borderRadius: width / 2}, this.props.style]}
        onError={this.onError}
      />
    );
  }

  renderOnlineBadge() {
    let {user, hideOnlineBadge} = this.props;
    if (hideOnlineBadge) return null;

    if (user && user.hasOwnProperty('presence') && user.presence === 'active')
      return <View style={styles.onlineBadge} />;
    return null;
  }

  renderPlaceholder() {
    return (
      <View style={{flex: 1, backgroundColor: '#562E52', borderRadius: px(360)}}>
        <FastImage
          source={require('../assets/img/slack-logo-white.png')}
          style={{width: '100%', height: '100%'}}
        />
      </View>
    );
  }

  render() {
    let {width, onPress} = this.props;

    return (
      <TouchableOpacity
        disabled={!onPress}
        onPress={onPress}
        style={[
          styles.container,
          {width, height: width, borderRadius: width / 2},
          this.props.containerStyle,
        ]}>
        {this.state.errored ? (
          this.renderPlaceholder()
        ) : (
          <>
            {this.renderImage()}
            {this.renderOnlineBadge()}
          </>
        )}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#eee',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: px(3),
    left: px(3),
    width: px(10),
    height: px(10),
    backgroundColor: '#3DBA91',
    borderRadius: px(5),
  },
});

const mapStateToProps = (state: RootState, ownProps) => ({
  user: state.entities.users.byId[ownProps.userId],
  token: currentTeamTokenSelector(state),
});

export default connect(mapStateToProps)(Avatar);
