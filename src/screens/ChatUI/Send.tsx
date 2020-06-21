import React, {FC} from 'react';
import {StyleSheet, Platform} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import px from '../../utils/normalizePixel';
import Touchable from '../../components/Touchable';

interface Props {
  onPress(): void;
  isVoice?: boolean;
}

const Send: FC<Props> = ({onPress, isVoice = false}) => {
  const renderSendIcon = () => (
    <MaterialCommunityIcons
      name="send"
      size={px(19)}
      color="#fff"
      style={Platform.select({
        default: {marginLeft: px(2.5), marginTop: px(2.5)},
        android: {marginLeft: px(2.5)},
      })}
    />
  );
  const renderVoiceIcon = () => (
    <MaterialCommunityIcons
      name="microphone"
      size={px(21)}
      color="#fff"
      style={Platform.select({
        ios: {marginLeft: px(2.5), marginTop: px(2.5)},
        android: {marginLeft: px(2.5)},
        web: {marginTop: px(2.5)},
      })}
    />
  );

  return (
    <Touchable style={styles.conatiner} onPress={onPress}>
      {isVoice ? renderVoiceIcon() : renderSendIcon()}
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    elevation: 1,
  },
});

export default Send;
