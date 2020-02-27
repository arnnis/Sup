import React, {FC, useContext} from 'react';
import {Text, View, StyleSheet, Platform} from 'react-native';
import Touchable from '../../components/Touchable';
import {RootState} from '../../reducers';
import {useSelector, useDispatch} from 'react-redux';
import px from '../../utils/normalizePixel';
import {MessageReaction} from '../../models';
import Emoji from './Emoji';
import {meSelector} from '../../reducers/teams';
import {removeReactionRequest, addReactionRequest} from '../../actions/messages/thunks';
import ThemeContext from '../../contexts/theme';

interface Props {
  messageId: string;
  hideAvatar?: boolean;
}

const Reactions: FC<Props> = React.memo(({messageId, hideAvatar}) => {
  const {theme} = useContext(ThemeContext);
  const {me, isMe, reactions} = useSelector((state: RootState) => {
    let message = state.entities.messages.byId[messageId];
    return {
      me: meSelector(state),
      isMe: meSelector(state)?.id === message?.user,
      reactions: message?.reactions,
    };
  });
  const dispatch = useDispatch();

  const handleReactionPress = (reaction: MessageReaction) => {
    if (reaction.users.includes(me.id)) {
      dispatch(removeReactionRequest(reaction.name, messageId));
    } else {
      dispatch(addReactionRequest(reaction.name, messageId));
    }
  };

  const renderReactionCell = (reaction: MessageReaction) => {
    const isSelected = reaction.users.includes(me.id);
    return (
      <Touchable
        style={[
          styles.reaction,
          {backgroundColor: theme.backgroundColor},
          isSelected && styles.reactionSelected,
        ]}
        onPress={() => handleReactionPress(reaction)}>
        <Emoji name={reaction.name} />
        <Text style={[styles.count, {color: theme.foregroundColor}]}>{reaction.count}</Text>
      </Touchable>
    );
  };

  return (
    <View
      style={[
        styles.container,
        isMe && styles.reactionsRight,
        !hideAvatar && {paddingHorizontal: px(43)},
      ]}>
      {reactions?.map(renderReactionCell)}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: px(15),
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: px(7.5),
    marginTop: Platform.select({
      android: px(-1),
      default: px(-3),
    }),
  },
  reactionsRight: {
    justifyContent: 'flex-end',
  },
  reaction: {
    borderRadius: px(5),
    backgroundColor: '#eee',
    marginLeft: px(7.5),
    justifyContent: 'center',
    alignItems: 'center',
    padding: Platform.select({
      web: px(3),
      default: px(5),
    }),
    flexDirection: 'row',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.09,
    shadowRadius: 0.5,

    elevation: 0.5,
  },
  reactionSelected: {
    borderColor: 'blue',
    borderWidth: px(1),
  },
  count: {
    fontSize: px(12.5),
    marginLeft: px(2.5),
  },
});

export default Reactions;
