import React, {FC, useState} from 'react';
import {View, StyleSheet, Modal, ActivityIndicator} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';

import {MessageAttachement} from '../../models';
import {currentTeamTokenSelector} from '../../reducers/teams';
import Touchable from '../../components/Touchable';
import px from '../../utils/normalizePixel';

interface Props {
  open: boolean;
  onDismiss(): void;
  images: MessageAttachement[];
}

const ImagesPreview: FC<Props> = ({open, images, onDismiss}) => {
  const token = useSelector(currentTeamTokenSelector);
  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      // @ts-ignore
      style={{margin: 0}}>
      <ImageViewer
        imageUrls={images.map(img => ({
          url: img.url_private,
          props: {headers: {Authorization: 'Bearer ' + token}},
        }))}
        onCancel={onDismiss}
        loadingRender={() => <ActivityIndicator size="large" color="#fff" />}
        enableSwipeDown
        onSwipeDown={onDismiss}
      />
      <Touchable
        onPress={onDismiss}
        style={{
          position: 'absolute',
          top: px(25),
          left: px(15),
          backgroundColor: 'purple',
          justifyContent: 'center',
          alignItems: 'center',
          width: px(30),
          height: px(30),
          borderRadius: px(15),
        }}>
        <MaterialCommunityIcons
          name="close"
          color="#fff"
          size={px(18)}
          style={{marginTop: px(2.5)}}
        />
      </Touchable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ImagesPreview;
