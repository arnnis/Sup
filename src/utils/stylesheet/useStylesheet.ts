import {useEffect, useState} from 'react';
import {Dimensions, ScaledSize, Platform} from 'react-native';

const getOrientation = () =>
  Dimensions.get('window').width > Dimensions.get('window').height ? 'landscape' : 'portrait';

export type Orientation = 'portrait' | 'landscape';
export interface MediaQuery {
  orientation?: Orientation;
  condition?: boolean;
  platform?: string;
}

export const mediaQuery = (
  {orientation, platform, condition}: MediaQuery,
  currentOrientation: Orientation,
): boolean => {
  return (
    (orientation === undefined || orientation === currentOrientation) &&
    (platform === undefined || platform === Platform.OS) &&
    (condition === undefined || condition)
  );
};

export default inputStylesheet => {
  const [stylesheet, setStylesheet] = useState(null);
  const [dimensions, setDimensions] = useState<ScaledSize>(Dimensions.get('window'));
  const [currentOrientation, setOrientation] = useState<Orientation>(getOrientation());

  useEffect(() => {
    Dimensions.addEventListener('change', onDimensionChange);
    return () => Dimensions.removeEventListener('change', onDimensionChange);
  }, []);

  const onDimensionChange = ({window: {width, height, scale, fontScale}}: {window: ScaledSize}) => {
    setDimensions({width, height, scale, fontScale});
    setOrientation(getOrientation());
  };

  const applyMediaQueryToStyleObject = (query: MediaQuery, style) => {
    if (mediaQuery(query, currentOrientation))
      return {
        ...style,
        ...style[query],
      };
    return style;
  };

  const transformInputStylesheet = () => {
    const outputStylesheet = {};
    for (let stylesName in inputStylesheet) {
      let styleObject = inputStylesheet[stylesName];
      for (let property in styleObject) {
        if (typeof property === 'object') {
          outputStylesheet[stylesName] = applyMediaQueryToStyleObject(property, styleObject);
          delete styleObject[property];
        }
      }
    }
    setStylesheet(outputStylesheet);
  };

  transformInputStylesheet();

  return stylesheet;
};
