import React, {PureComponent} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import dayjs from 'dayjs';

import {isSameDay} from './utils';
import {Message} from '../../models';
import px from '../../utils/normalizePixel';

type Props = {
  currentMessage?: Message;
  prevMessage?: Message | undefined;
};

class Day extends PureComponent<Props> {
  render() {
    const {currentMessage, prevMessage} = this.props;

    if (currentMessage && !isSameDay(currentMessage, prevMessage)) {
      return (
        <View style={styles.container}>
          <View style={styles.wrapper}>
            <Text style={styles.text}>
              {dayjs
                .unix(Number(currentMessage.ts.split('.')[0]))
                .local()
                .format('DD MMMM')}
            </Text>
          </View>
        </View>
      );
    }
    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: px(5),
    marginBottom: px(10),
    borderRadius: px(5),
  },
  wrapper: {
    borderRadius: px(10),
    backgroundColor: 'purple',
  },
  text: {
    color: '#fff',
    fontSize: px(12),
    fontWeight: '600',
    padding: px(2.5),
    paddingHorizontal: px(5),
  },
});

export default Day;
