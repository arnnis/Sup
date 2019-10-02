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

    if (profile)
      return (
        <Image
          source={{uri: profile.image_48}}
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
