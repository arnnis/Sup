import React, {FC, useState} from 'react';
import {Modal, ActivityIndicator, StyleSheet, View, Text} from 'react-native';
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
  initalIndex: number;
  images: MessageAttachement[];
}

const ImagesPreview: FC<Props> = ({open, images, onDismiss, initalIndex}) => {
  const [index, setIndex] = useState(initalIndex);
  const token = useSelector(currentTeamTokenSelector);

  const normalizeImages = () =>
    images.map(img => ({
      url: img.url_private_download,
      props: {headers: {Authorization: 'Bearer ' + token}},
    }));

  const renderLoading = () => <ActivityIndicator size="large" color="#fff" />;

  const renderDismissButton = () => (
    <Touchable onPress={onDismiss} style={styles.dismissButtonContainer}>
      <MaterialCommunityIcons
        name="close"
        color="#fff"
        size={px(18)}
        style={{marginTop: px(2.5)}}
      />
    </Touchable>
  );

  const renderNextButton = () =>
    images.length > 1 && (
      <View style={styles.nextButtonContainer}>
        <MaterialCommunityIcons
          name="chevron-right"
          color="#fff"
          size={px(30)}
          style={{marginTop: px(2.5), marginHorizontal: px(20)}}
        />
      </View>
    );

  const renderPreviousButton = () =>
    images.length > 1 && (
      <View style={styles.previousButtonContainer}>
        <MaterialCommunityIcons
          name="chevron-left"
          color="#fff"
          size={px(30)}
          style={{marginTop: px(2.5), marginHorizontal: px(20)}}
        />
      </View>
    );

  const renderIndicator = (currentIndex, allSize) =>
    images.length > 1 && (
      <View
        style={[
          StyleSheet.absoluteFillObject,
          {top: px(38), bottom: undefined, alignItems: 'center'},
        ]}>
        <View style={styles.indicatorContainer}>
          <Text style={styles.indicatorText}>
            {currentIndex}/<Text style={{fontSize: px(11)}}>{allSize}</Text>
          </Text>
        </View>
      </View>
    );

  const renderImageThumbnails = () => ({});

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      // @ts-ignore
      style={{margin: 0}}>
      <ImageViewer
        imageUrls={normalizeImages()}
        onCancel={onDismiss}
        loadingRender={renderLoading}
        enableSwipeDown
        onSwipeDown={onDismiss}
        index={index}
        renderArrowRight={renderNextButton}
        renderArrowLeft={renderPreviousButton}
        renderIndicator={renderIndicator}
      />
      {renderDismissButton()}
    </Modal>
  );
};

const styles = StyleSheet.create({
  dismissButtonContainer: {
    position: 'absolute',
    top: px(35),
    left: px(25),
    backgroundColor: 'purple',
    justifyContent: 'center',
    alignItems: 'center',
    width: px(30),
    height: px(30),
    borderRadius: px(15),
  },
  indicatorContainer: {
    backgroundColor: 'purple',
    borderRadius: px(15),
    paddingHorizontal: px(8),
    paddingVertical: px(4),
  },
  indicatorText: {
    color: '#fff',
    fontSize: px(16),
    fontWeight: 'bold',
  },
  nextButtonContainer: {
    position: 'absolute',
    right: px(20),
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  previousButtonContainer: {
    position: 'absolute',
    left: px(20),
    marginTop: 'auto',
    marginBottom: 'auto',
  },
});

export default ImagesPreview;
