import React, {FC, useContext} from 'react';
import Dropzone from 'react-dropzone';
import {View, StyleSheet, Text} from 'react-native';
import ThemeContext from '../../contexts/theme';
import px from '../../utils/normalizePixel';
import {Platform} from '../../utils/platform';

// This only gonna work on Web. cuz react-dropzone is web only
const UploadDropZoneWeb = ({children}) => {
  const {theme} = useContext(ThemeContext);

  const renderOverlay = () => (
    <View style={[styles.overlay, {backgroundColor: theme.backgroundColor}]}>
      <Text>Drop here to upload</Text>
    </View>
  );

  if (Platform.isNative) return children;

  return (
    <Dropzone onDrop={acceptedFiles => console.log(acceptedFiles)}>
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
});

export default UploadDropZoneWeb;
