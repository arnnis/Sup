import React, {FC} from 'react';
import {RootState} from '../../reducers';
import {useSelector} from 'react-redux';
import {Text, StyleSheet} from 'react-native';
import px from '../../utils/normalizePixel';

interface Props {
  chatId: string;
}

const DirectPresense: FC<Props> = React.memo(({chatId}) => {
  const {user} = useSelector((state: RootState) => {
    let chat = state.entities.chats.byId[chatId];
    let user = state.entities.users.byId[chat?.user_id];
    return {
      user,
    };
  });

  return (
    <Text style={styles.membersCount}>{user?.presence === 'active' ? 'online' : 'offline'}</Text>
  );
});

const styles = StyleSheet.create({
  membersCount: {
    color: '#fff',
    marginTop: px(2.5),
    fontSize: px(13.5),
  },
});

export default DirectPresense;
