import React, {Component} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {IMessage} from 'react-native-gifted-chat';
import Touchable from '../../components/Touchable';
import emojis from '../../utils/emoji';
import {RootState} from '../../reducers';
import {connect} from 'react-redux';
import px from '../../utils/normalizePixel';
import {MessageReaction} from '../../models';
import Emoji from './Emoji';

type Props = ReturnType<typeof mapStateToProps> & {
  gMessage: IMessage;
};

class Reactions extends Component<Props> {
  renderReactionCell = (reaction: MessageReaction) => {
    return (
      <Touchable style={styles.reaction} onPress={() => {}}>
        <Emoji name={reaction.name} />
        <Text style={styles.count}>{reaction.count}</Text>
      </Touchable>
    );
  };

  render() {
    let {me, entities, gMessage} = this.props;
    let message = entities.messages.byId[gMessage._id];

    if (!message) return null;

    return (
      <View
        style={[
          styles.container,
          me.id === gMessage.user._id && styles.reactionsRight,
        ]}>
        {message.reactions &&
          message.reactions.length &&
          message.reactions.map(reaction => {
            return this.renderReactionCell(reaction);
          })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: px(10),
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: px(7.5),
  },
  reactionsRight: {
    justifyContent: 'flex-end',
  },
  reaction: {
    borderRadius: px(15),
    backgroundColor: '#eee',
    marginLeft: px(7.5),
    justifyContent: 'center',
    alignItems: 'center',
    padding: px(5),
    flexDirection: 'row',
  },
  count: {
    fontSize: px(12.5),
  },
});

const mapStateToProps = (state: RootState) => ({
  entities: state.entities,
  me:
    state.entities.users.byId[
      state.teams.list.find(ws => ws.id === state.teams.currentTeam).userId
    ],
});

export default connect(mapStateToProps)(Reactions);
