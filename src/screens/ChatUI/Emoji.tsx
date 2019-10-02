import React, {FC} from 'react';
import {Text, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import {RootState} from '../../reducers';
import emojis from '../../utils/emoji';
import px from '../../utils/normalizePixel';

type Props = ReturnType<typeof mapStateToProps> & {
  name: string;
};

const Emoji: FC<Props> = ({name, emojisEntities}) => {
  let allEmojis = {...emojis, ...emojisEntities.byId};
  return (
    <Text style={styles.emoji}>
      {allEmojis[name] && allEmojis[name].native}
    </Text>
  );
};

const styles = StyleSheet.create({
  emoji: {
    fontSize: px(11.5),
  },
});

const mapStateToProps = (state: RootState) => ({
  emojisEntities: state.entities.emojis,
});

export default connect(mapStateToProps)(Emoji);
