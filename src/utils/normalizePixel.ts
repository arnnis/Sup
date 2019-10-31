// TODO: move this to layout context.

import {Platform} from 'react-native';
import rem from './stylesheet/rem';

function px(pixelSize = 1) {
  return Platform.select({
    android: rem(pixelSize),
    default: pixelSize,
  });
}

export default px;
