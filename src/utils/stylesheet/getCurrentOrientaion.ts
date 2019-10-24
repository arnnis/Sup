import {Dimensions} from 'react-native';

export default () => {
  let dims = Dimensions.get('window');

  return dims.width > dims.height ? 'landscape' : 'portrait';
};
