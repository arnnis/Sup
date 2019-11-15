import React, {FC} from 'react';
import dayjs from 'dayjs';
import {Text, StyleSheet, View} from 'react-native';
import px from '../../utils/normalizePixel';
import {connect} from 'react-redux';
import {RootState} from '../../reducers';

type Props = ReturnType<typeof mapStateToProps> & {
  messageId: string;
};

const MessageDate: FC<Props> = ({ts}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {dayjs
          .unix(Number(ts.split('.')[0]))
          .local()
          .format('HH:MM')}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft: px(4),
    marginTop: px(1),
  },
  text: {
    fontSize: px(9),
    color: '#ccc',
  },
});

const mapStateToProps = (state: RootState, ownProps) => ({
  ts: state.entities.messages.byId[ownProps.messageId]?.ts,
});

export default connect(mapStateToProps)(MessageDate);
