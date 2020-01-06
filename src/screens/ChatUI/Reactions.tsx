import React, {Component} from 'react';
import {Text, View, StyleSheet, Platform} from 'react-native';
import Touchable from '../../components/Touchable';
import {RootState} from '../../reducers';
import {connect} from 'react-redux';
import px from '../../utils/normalizePixel';
import {MessageReaction} from '../../models';
import Emoji from './Emoji';
import {meSelector} from '../../reducers/teams';
import withTheme, {ThemeInjectedProps} from '../../contexts/theme/withTheme';

type Props = ReturnType<typeof mapStateToProps> &
  ThemeInjectedProps & {
    messageId: string;
    hideAvatar: boolean;
  };

class Reactions extends Component<Props> {
  renderReactionCell = (reaction: MessageReaction) => {
    let {theme} = this.props;
    return (
      <Touchable
        style={[styles.reaction, {backgroundColor: theme.backgroundColor}]}
        onPress={() => {}}>
        <Emoji name={reaction.name} />
        <Text style={[styles.count, {color: theme.foregroundColor}]}>{reaction.count}</Text>
      </Touchable>
    );
  };

  render() {
    let {isMe, reactions, hideAvatar} = this.props;
    if (!reactions || !reactions.length) return null;
    return (
      <View
        style={[
          styles.container,
          isMe && styles.reactionsRight,
          !hideAvatar && {paddingHorizontal: px(43)},
        ]}>
        {reactions.map(reaction => {
          return this.renderReactionCell(reaction);
        })}
      </View>
    );
  }
}

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
  count: {
    fontSize: px(12.5),
    marginLeft: px(2.5),
  },
});

const mapStateToProps = (state: RootState, ownProps) => {
  let message = state.entities.messages.byId[ownProps.messageId];
  return {
    isMe: meSelector(state)?.id === message?.user,
    reactions: message?.reactions,
  };
};

export default connect(mapStateToProps)(withTheme(Reactions));
