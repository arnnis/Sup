import React, {FC, useContext} from 'react';
import Dropzone from 'react-dropzone';
import {View, StyleSheet, Text, ViewStyle} from 'react-native';
import ThemeContext from '../../contexts/theme';
import px from '../../utils/normalizePixel';
import {Platform} from '../../utils/platform';
import {useDispatch} from 'react-redux';
import {openBottomSheet} from '../../actions/app';

interface Props {
  onDrop(files: File[]): void;
  placeholder?: string;
  style?: ViewStyle;
}

// This only gonna work on Web. cuz react-dropzone is web only
const UploadDropZoneWeb: FC<Props> = ({children, onDrop, placeholder, style}) => {
  const {theme} = useContext(ThemeContext);

  const renderOverlay = () => (
    <View style={[styles.overlay, {backgroundColor: theme.backgroundColor}, style]}>
      <Text style={[styles.overlayText, {color: theme.foregroundColor}]}>
        {placeholder || 'Drop here to upload'}
      </Text>
    </View>
  );

  if (Platform.isNative) return <View style={{flex: 1}}>{children}</View>;

  return (
    <Dropzone onDrop={onDrop}>
      {({getRootProps, _, isDragActive}) => (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            height: '100%',
            width: '100%',
          }}
          {...getRootProps()}>
          {children}
          {isDragActive && renderOverlay()}
        </div>
      )}
    </Dropzone>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    margin: px(5),
    borderRadius: px(8),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: px(2),
    borderColor: '#3A1C39',
  },
  overlayText: {
    fontSize: px(16),
  },
});

export default UploadDropZoneWeb;
