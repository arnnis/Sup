import React, {FC} from 'react';
import {StyleSheet, Platform} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import px from '../../utils/normalizePixel';
import Touchable from '../../components/Touchable';

interface Props {
  onPress(): void;
}

const Send: FC<Props> = ({onPress}) => {
  return (
    <Touchable style={styles.conatiner} onPress={onPress}>
      <MaterialCommunityIcons
        name="send"
        size={px(19)}
        color="#fff"
        style={Platform.select({
          ios: {marginLeft: px(2.5), marginTop: px(2.5)},
          android: {marginLeft: px(2.5)},
        })}
      />
    </Touchable>
  );
};

const SIZE = px(40);

const styles = StyleSheet.create({
  conatiner: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: 'purple',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: px(5),
    marginBottom: px(2),
  },
});

export default Send;
