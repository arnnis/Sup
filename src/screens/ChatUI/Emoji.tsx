import React, {FC} from 'react';
import {Text, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import {RootState} from '../../reducers';
import emojis from '../../utils/emoji';
import px from '../../utils/normalizePixel';

type Props = ReturnType<typeof mapStateToProps> & {
  name: string;
};

const Emoji: FC<Props> = ({emoji}) => <Text style={styles.emoji}>{emoji}</Text>;

const styles = StyleSheet.create({
  emoji: {
    fontSize: px(11.5),
  },
});

const mapStateToProps = (state: RootState, ownProps) => ({
  emoji: {...emojis, ...state.entities.emojis.byId}[ownProps.name]?.native,
});

export default connect(mapStateToProps)(Emoji);
