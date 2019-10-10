import React, {Component} from 'react';
import {View, Text, StyleSheet, ViewStyle, TouchableOpacity} from 'react-native';
import px from '../utils/normalizePixel';
import FastImage from 'react-native-fast-image';
import {connect} from 'react-redux';
import {RootState} from '../reducers';

type Props = ReturnType<typeof mapStateToProps> & {
  userId: string;
  width?: number;
  style?: ViewStyle;
  onPress?(): void;
};

class Avatar extends Component<Props> {
  static defaultProps = {
    width: px(50),
  };

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

    return <FastImage source={{uri}} style={[styles.image, {borderRadius: width / 2}]} />;
  }

  renderOnlineBadge() {
    let {user, width} = this.props;

    if (user && user.hasOwnProperty('presence') && user.presence === 'active')
      return <View style={styles.onlineBadge} />;
    return null;
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
          this.props.style,
        ]}>
        {this.renderImage()}
        {this.renderOnlineBadge()}
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
});

export default connect(mapStateToProps)(Avatar);
