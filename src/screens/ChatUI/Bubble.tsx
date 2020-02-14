import React, {FC, useContext, memo, forwardRef} from 'react';
import {View, StyleSheet} from 'react-native';
import MessageText from './MessageText';
import px from '../../utils/normalizePixel';
import Name from './Name';
import MessageImages from './MessageImages';
import MessageFiles from './MessageFiles';
import MessageVideos from './MessageVideos';
import Replies from './Replies';
import MessageDate from './MessageDate';
import {useMediaQuery} from 'react-responsive';
import ThemeContext from '../../contexts/theme';

interface Props {
  messageId: string;
  userId: string;
  sameUser: boolean;
  isMe: boolean;
  pending: boolean;
  hideAvatar?: boolean;
  hideReplies?: boolean;
}

const Bubble: FC<Props> = ({
  messageId,
  userId,
  isMe,
  sameUser,
  pending,
  hideAvatar,
  hideReplies,
}) => {
  const isLandscape = useMediaQuery({orientation: 'landscape'});
  const {theme} = useContext(ThemeContext);

  const renderMessageText = () => <MessageText messageId={messageId} isMe={isMe} />;

  const renderMessageImages = () => <MessageImages messageId={messageId} />;

  const renderMessageVideos = () => <MessageVideos messageId={messageId} />;

  const renderMessageFiles = () => <MessageFiles messageId={messageId} />;

  const renderName = () => <Name userId={userId} isMe={isMe} />;

  const renderReplies = () => {
    if (hideReplies) return null;
    return <Replies messageId={messageId} isMe={isMe} />;
  };

  const renderSendDate = () => <MessageDate messageId={messageId} />;

  return (
    <View
      style={[
        styles.container,
        isLandscape && {maxWidth: '62%'},
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
      <View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          {renderName()}
          {renderSendDate()}
        </View>
        {renderMessageText()}
        {renderMessageImages()}
        {renderMessageVideos()}
        {renderMessageFiles()}
        {renderReplies()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: '68%',
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

export default Bubble;
