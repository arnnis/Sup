import React, {Component} from 'react';
import {View, Text, StyleSheet, Image, ViewStyle} from 'react-native';
import {User} from '../models';
import px from '../utils/normalizePixel';
import FastImage from 'react-native-fast-image';

interface Props {
  user: User;
  online?: boolean;
  width?: number;
  styles?: ViewStyle;
}

class Avatar extends Component<Props> {
  static defaultProps = {
    width: px(50),
  };

  renderImage() {
    let {
      user: {profile, name},
      width,
    } = this.props;

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

    if (profile)
      return (
        <Image
          source={{uri}}
          style={[styles.image, {borderRadius: width / 2}]}
        />
      );

    return (
      <View style={styles.image}>
        <Text>{name[0]}</Text>
      </View>
    );
  }

  renderOnlineBadge() {
    return <View style={styles.onlineBadge} />;
  }

  render() {
    let {width, user} = this.props;

    return (
      <View
        style={[
          styles.container,
          {width, height: width, borderRadius: width / 2},
          this.props.styles,
        ]}>
        {this.renderImage()}
        {user.hasOwnProperty('presence') &&
          user.presence === 'active' &&
          this.renderOnlineBadge()}
      </View>
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

export default Avatar;
