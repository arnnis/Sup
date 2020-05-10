import React, {FC, useEffect} from 'react';
import {Text, StyleSheet} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigation} from 'react-navigation-hooks';

import {RootState} from '../../reducers';
import px from '../../utils/normalizePixel';
import {getMember, goToUserProfile} from '../../slices/members-thunks';

interface Props {
  userId: string;
}

const Username: FC<Props> = React.memo(({userId}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {name} = useSelector((state: RootState) => {
    let user = state.entities.users.byId[userId];
    return {
      name: user?.name,
    };
  });
  useEffect(() => {
    if (!name) {
      dispatch(getMember(userId));
    }
  }, []);

  const handlePress = () => dispatch(goToUserProfile(userId, navigation));

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

export default Username;
