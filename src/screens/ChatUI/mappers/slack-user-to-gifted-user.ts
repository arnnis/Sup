import {User as GUser} from 'react-native-gifted-chat';
import {User as TUser} from '../../../models';

export default (user: TUser): GUser =>
  user
    ? {
        _id: user.id,
        name:
          user.profile.display_name_normalized ||
          user.profile.real_name_normalized,
        avatar: user.profile.image_48,
      }
    : {
        _id: 'loading',
        name: 'loading...',
      };
