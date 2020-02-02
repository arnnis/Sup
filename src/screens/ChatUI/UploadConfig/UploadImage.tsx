import React, {useState, useEffect, FC} from 'react';
import px from '../../../utils/normalizePixel';
import FastImage from 'react-native-fast-image';
import {Image} from 'react-native';

interface Props {
  uri: string;
}

const UploadImage: FC<Props> = ({uri}) => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const MAX_HEIGHT = px(200);
  const maxHeightToCurrentHeightRatio = MAX_HEIGHT / height;

  useEffect(() => {
    Image.getSize(
      uri,
      (w, h) => {
        setWidth(w);
        setHeight(h);
      },
      err => {},
    );
  }, []);

  return (
    <FastImage
      source={{uri}}
      style={{
        width: width * maxHeightToCurrentHeightRatio,
        height: height * maxHeightToCurrentHeightRatio,
      }}
      resizeMode="contain"
    />
  );
};

export default UploadImage;
