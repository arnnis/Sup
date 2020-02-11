import React, {FC} from 'react';
import {Text, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../../reducers';
import emojiesData from '../../utils/emoji';
import px from '../../utils/normalizePixel';

interface Props {
  name: string;
}

const Emoji: FC<Props> = React.memo(({name}) => {
  const slackEmojies = useSelector((state: RootState) => state.entities.emojis.byId);
  const emoji = {...emojiesData, ...slackEmojies}[name]?.native;

  return <Text style={styles.emoji}>{emoji}</Text>;
});

const styles = StyleSheet.create({
  emoji: {
    fontSize: px(11.5),
  },
});

export default Emoji;
