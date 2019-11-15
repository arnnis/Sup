import React, {FC} from 'react';
import {MediaQuery as MediaQueryType, mediaQuery} from './useStylesheet';
import useDimensions from './useDimensions';

type MediaQueryProps = MediaQueryType;

const MediaQuery: FC<MediaQueryProps> = ({children, ...props}) => {
  const {width, height} = useDimensions();
  const val = mediaQuery(props, width > height ? 'landscape' : 'portrait');
  if (val) {
    return children;
  }
  return null;
};

export default MediaQuery;
