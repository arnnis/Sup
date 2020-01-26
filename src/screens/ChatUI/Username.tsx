import React, {FC, memo, useEffect} from 'react';
import {Text, StyleSheet} from 'react-native';
import {connect, DispatchProp} from 'react-redux';
import {RootState} from '../../reducers';
import px from '../../utils/normalizePixel';
import {NavigationInjectedProps, withNavigation} from 'react-navigation';
import {getMember, goToUserProfile} from '../../actions/members/thunks';

type Props = ReturnType<typeof mapStateToProps> &
  DispatchProp<any> &
  NavigationInjectedProps & {
    userId: string;
  };

const Username: FC<Props> = memo(({userId, name, navigation, dispatch}) => {
  useEffect(() => {
    if (!name) {
      dispatch(getMember(userId));
    }
  }, []);
  let handlePress = () => dispatch(goToUserProfile(userId, navigation));

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
    name: user?.name,
  };
};

export default connect(mapStateToProps)(withNavigation(Username));
