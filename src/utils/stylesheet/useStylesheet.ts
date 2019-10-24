import {useEffect, useState} from 'react';
import {Dimensions, ScaledSize, Platform, StyleProp} from 'react-native';

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

const applyMediaQueryToStyleObject = (
  media: MediaQuery & {style: any},
  style,
  currentOrientation,
) => {
  if (mediaQuery(media[0], currentOrientation))
    return {
      ...style,
      ...media[1],
      media: undefined,
    };
  return {...style, media: undefined};
};

export const transformInputStylesheet = (inputStylesheet, currentOrientation) => {
  const outputStylesheet = {};
  for (let stylesName in inputStylesheet) {
    let styleObject = inputStylesheet[stylesName];
    let media = styleObject['media'];
    if (media) {
      outputStylesheet[stylesName] = applyMediaQueryToStyleObject(
        media,
        styleObject,
        currentOrientation,
      );
    }
  }
  return outputStylesheet;
};

export default inputStylesheet => {
  const [currentOrientation, setOrientation] = useState<Orientation>(getOrientation());
  const [stylesheet, setStylesheet] = useState(
    transformInputStylesheet(inputStylesheet, currentOrientation),
  );
  const [dimensions, setDimensions] = useState<ScaledSize>(Dimensions.get('window'));

  useEffect(() => {
    Dimensions.addEventListener('change', onDimensionChange);
    return () => Dimensions.removeEventListener('change', onDimensionChange);
  }, []);

  const onDimensionChange = ({window: {width, height, scale, fontScale}}: {window: ScaledSize}) => {
    console.log('got here');
    setDimensions({width, height, scale, fontScale});
    setOrientation(getOrientation());
    const outputStylesheet = transformInputStylesheet(inputStylesheet, getOrientation());
    setStylesheet(outputStylesheet);
  };

  return stylesheet;
};
