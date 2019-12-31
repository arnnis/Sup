import React, {Component} from 'react';
import {View, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import MessageText from './MessageText';
import px from '../../utils/normalizePixel';
import Name from './Name';
import withTheme, {ThemeInjectedProps} from '../../contexts/theme/withTheme';
import MessageImages from './MessageImages';
import MessageFiles from './MessageFiles';
import MessageVideos from './MessageVideos';
import Replies from './Replies';
import withStylesheet, {StyleSheetInjectedProps} from '../../utils/stylesheet/withStylesheet';
import MessageDate from './MessageDate';
import showMenu from '../../utils/showMenu';
import {withNavigation, NavigationInjectedProps} from 'react-navigation';
import {connect, DispatchProp} from 'react-redux';
import {RootState} from '../../reducers';
import {goToThread} from '../../actions/chats/thunks';

type Props = ThemeInjectedProps &
  StyleSheetInjectedProps &
  NavigationInjectedProps &
  DispatchProp<any> &
  ReturnType<typeof mapStateToProps> & {
    messageId: string;
    userId: string;
    sameUser: boolean;
    isMe: boolean;
    pending: boolean;
    hideAvatar?: boolean;
    hideReplies?: boolean;
  };

class Bubble extends Component<Props> {
  goToThread = () => {
    this.props.dispatch(goToThread(this.props.messageId, this.props.navigation));
  };

  openMessageContextMenu = () => {
    showMenu(
      [
        {
          title: 'Reply',
          onPress: this.goToThread,
        },
        // {
        //   title: 'Edit',
        //   onPress: () => alert('Edit?'),
        // },
      ],
      this.refs['bubble'],
    );
  };

  renderMessageText() {
    return <MessageText messageId={this.props.messageId} isMe={this.props.isMe} />;
  }

  renderMessageImages() {
    return <MessageImages messageId={this.props.messageId} />;
  }

  renderMessageVideos() {
    return <MessageVideos messageId={this.props.messageId} />;
  }

  renderMessageFiles() {
    return <MessageFiles messageId={this.props.messageId} />;
  }

  renderName() {
    return <Name userId={this.props.userId} isMe={this.props.isMe} />;
  }

  renderReplies() {
    if (this.props.hideReplies) return null;
    return <Replies messageId={this.props.messageId} isMe={this.props.isMe} />;
  }

  renderSendDate() {
    return <MessageDate messageId={this.props.messageId} />;
  }

  render() {
    let {sameUser, isMe, pending, theme, hideAvatar, dynamicStyles} = this.props;

    return (
      <View
        ref="bubble"
        style={[
          styles.container,
          dynamicStyles.container,
          {backgroundColor: theme.backgroundColor},
          isMe && styles.right,
          !sameUser && {
            borderBottomLeftRadius: isMe ? 5 : 0,
            borderBottomRightRadius: isMe ? 0 : 5,
          },
          pending && {
            opacity: 0.5,
          },
          hideAvatar &&
            sameUser && {
              marginLeft: !isMe ? px(7.5) : 0,
              marginRight: isMe ? px(7.5) : 0,
            },
        ]}>
        <TouchableWithoutFeedback onLongPress={this.openMessageContextMenu}>
          <View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              {this.renderName()}
              {this.renderSendDate()}
            </View>

            {this.renderMessageText()}
            {this.renderMessageImages()}
            {this.renderMessageVideos()}
            {this.renderMessageFiles()}
            {this.renderReplies()}
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: px(5),
    padding: px(5),
    paddingHorizontal: px(7.5),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.09,
    shadowRadius: 0.5,

    elevation: 0.5,
  },
  right: {
    backgroundColor: 'purple',
  },
});

const dynamicStyles = {
  container: {
    maxWidth: '68%',
    media: [
      {orientation: 'landscape'},
      {
        maxWidth: '62%',
      },
    ],
  },
};

const mapStateToProps = (state: RootState) => ({
  currentChatId: state.chats.currentChatId,
});

export default connect(mapStateToProps)(
  withTheme(withStylesheet(dynamicStyles)(withNavigation(Bubble))),
);
