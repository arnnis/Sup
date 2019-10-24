import React, {FC} from 'react';
import {View, StyleSheet} from 'react-native';
import {RootState} from '../../reducers';
import {currentTeamSelector} from '.';
import {connect} from 'react-redux';
import Touchable from '../../components/Touchable';
import FastImage from 'react-native-fast-image';
import px from '../../utils/normalizePixel';

type Props = ReturnType<typeof mapStateToProps> & {
  onPress(): void;
};

const ChangeTeamButton: FC<Props> = ({currentTeam, onPress}) => (
  <Touchable style={styles.teamLogo} onPress={onPress}>
    <FastImage
      source={{
        uri: currentTeam && currentTeam.icon && currentTeam.icon.image_44,
      }}
      style={{width: '100%', height: '100%', borderRadius: px(3)}}
    />
  </Touchable>
);

const styles = StyleSheet.create({
  teamLogo: {
    height: px(32),
    width: px(32),
    backgroundColor: '#eee',
    borderRadius: px(3),
  },
});

const mapStateToProps = (state: RootState) => ({
  currentTeam: currentTeamSelector(state),
});

export default connect(mapStateToProps)(ChangeTeamButton);
