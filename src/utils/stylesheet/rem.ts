// TODO: move this to layout context.

import {Dimensions, PixelRatio} from 'react-native';
const {width, height} = Dimensions.get('window');

/**
 * Converts px to rem
 */

// base values from iPhone 8
let baseWidth = 375;
let baseHeight = 667;
let baseRatio = baseHeight / baseWidth; // 1.7786666666666;

let ratio = height / width;
let scale = ((ratio / baseRatio) * width) / baseWidth;

let cache = {};

function rem(pixelSize = 1) {
  let result = scale * pixelSize;
  if (cache[pixelSize]) return cache[pixelSize];
  cache[pixelSize] = result;
  return result;
}

export default rem;
