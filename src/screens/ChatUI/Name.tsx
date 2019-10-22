import React, {FC, memo} from 'react';
import {Text, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import {RootState} from '../../reducers';
import px from '../../utils/normalizePixel';

type Props = ReturnType<typeof mapStateToProps> & {
  userId: string;
  isMe: boolean;
};

const Name: FC<Props> = memo(({name, isMe}) => (
  <Text style={[styles.text, {color: isMe ? '#fff' : '#333'}]}>{name || 'loading...'}</Text>
));

const styles = StyleSheet.create({
  text: {
    fontSize: px(12.5),
    color: '#fff',
    marginBottom: px(2.5),
    fontWeight: '500',
  },
});

const mapStateToProps = (state: RootState, ownProps) => {
  let user = state.entities.users.byId[ownProps.userId];
  return {
    name: user && (user.profile.display_name_normalized || user.profile.real_name_normalized),
  };
};

export default connect(mapStateToProps)(Name);
