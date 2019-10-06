import React, {FC, memo} from 'react';
import {Text, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import {RootState} from '../../reducers';
import px from '../../utils/normalizePixel';
import {NavigationInjectedProps, withNavigation} from 'react-navigation';

type Props = ReturnType<typeof mapStateToProps> &
  NavigationInjectedProps & {
    userId: string;
  };

const Username: FC<Props> = memo(({userId, name, navigation}) => {
  let handlePress = () => {
    navigation.push('UserProfile', {userId});
  };
  return (
    <Text style={styles.text} onPress={handlePress}>
      {name ? `@${name}` : '@loading...'}
    </Text>
  );
});

const styles = StyleSheet.create({
  text: {
    fontSize: px(15),
    color: '#AC5A9B',
    fontWeight: '500',
  },
});

const mapStateToProps = (state: RootState, ownProps) => {
  let user = state.entities.users.byId[ownProps.userId];
  return {
    name: user && user.name,
  };
};

export default connect(mapStateToProps)(withNavigation(Username));
