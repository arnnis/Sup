import {Message, User} from '../../../models';
import {IMessage} from 'react-native-gifted-chat';
import getUser from './slack-user-to-gifted-user';

export default (message: Message, user: User): IMessage => {
  let image =
    message.files && message.files.length && message.files[0].thumb_360;

  let video =
    message.files &&
    message.files &&
    message.files[0].mimetype.startsWith['video'] &&
    message.files[0].url_private_download;

  return {
    _id: message.ts,
    text: message.text,
    createdAt: Number(message.ts.split('.')[0]) * 1000,
    user: getUser(user),
    image,
    system: message.subtype ? true : false,
    // video:
    //   'https://files.slack.com/files-pri/TMYS2CUFQ-FNHBT8J8K/download/america_fuck_yeah_.mp4',
    // audio?: string,
    // system?: boolean,
    // sent?: boolean,
    // received: boolean,
    // pending?: boolean,
    // quickReplies?: QuickReplies
  };
};
