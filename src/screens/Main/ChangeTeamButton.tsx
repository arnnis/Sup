import React, {FC} from 'react';
import {View, StyleSheet} from 'react-native';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {RootState} from '../../reducers';
import {connect} from 'react-redux';
import Touchable from '../../components/Touchable';
import FastImage from 'react-native-fast-image';
import px from '../../utils/normalizePixel';
import {currentTeamSelector} from '../../slices/teams-slice';

type Props = ReturnType<typeof mapStateToProps> & {
  onPress(): void;
};

const ChangeTeamButton: FC<Props> = ({currentTeam, onPress}) => (
  <Touchable style={styles.teamLogo} onPress={onPress}>
    {currentTeam ? (
      <FastImage
        source={{
          uri: currentTeam && currentTeam.icon && currentTeam.icon.image_44,
        }}
        style={{width: '100%', height: '100%', borderRadius: px(3)}}
      />
    ) : (
      <MaterialCommunityIcons name="plus" size={px(22)} color="#333" />
    )}
  </Touchable>
);

const styles = StyleSheet.create({
  teamLogo: {
    height: px(32),
    width: px(32),
    backgroundColor: '#eee',
    borderRadius: px(3),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const mapStateToProps = (state: RootState) => ({
  currentTeam: currentTeamSelector(state),
});

export default connect(mapStateToProps)(ChangeTeamButton);
