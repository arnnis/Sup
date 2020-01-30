import React, {Component, FC, useState, useEffect} from 'react';
import {View, StyleSheet, Modal, TouchableWithoutFeedback, ActivityIndicator} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import FastImage from 'react-native-fast-image';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {RootState} from '../../reducers';
import {createSelector} from 'reselect';
import {Message, MessageAttachement} from '../../models';
import px from '../../utils/normalizePixel';
import {connect, useSelector} from 'react-redux';
import {currentTeamTokenSelector} from '../../reducers/teams';
import Touchable from '../../components/Touchable';
import ImagesPreview from './ImagesPreview';

type Props = ReturnType<typeof mapStateToProps> & {
  messageId: string;
};

class MessageImages extends Component<Props> {
  state = {
    imageViewerVisible: false,
  };

  handlePreviewDismiss = () => this.setState({imageViewerVisible: false});

  renderImage(image: MessageAttachement, isSingle) {
    console.log(image);
    let desiredHeight: number, uri: string, mainSize: {width: number; height: number};

    if (isSingle) {
      desiredHeight = px(200);
      uri = image.thumb_360;
      mainSize = {
        width: image.thumb_360_w,
        height: image.thumb_360_h,
      };
    } else {
      desiredHeight = px(125);
      uri = image.thumb_480 || image.thumb_360;
      mainSize = {
        width: image.thumb_480_w || image.thumb_360_w,
        height: image.thumb_480_h || image.thumb_360_h,
      };
    }
    return (
      <MessageImage
        uri={uri}
        desiredHeight={desiredHeight}
        mainSize={mainSize}
        onPress={() => this.setState({imageViewerVisible: true})}
      />
    );
  }

  render() {
    let {images} = this.props;
    if (!images) return null;

    const isSingle = !images.length;

    return (
      <>
        <View style={styles.container}>
          {images.map(image => this.renderImage(image, isSingle))}
        </View>
        <ImagesPreview
          open={this.state.imageViewerVisible}
          images={images}
          onDismiss={this.handlePreviewDismiss}
        />
      </>
    );
  }
}

interface MessageImage {
  uri: string;
  desiredHeight: number;
  mainSize: {
    width: number;
    height: number;
  };
  onPress(): void;
}

export const MessageImage: FC<MessageImage> = ({uri, desiredHeight, mainSize, onPress}) => {
  let token = useSelector(currentTeamTokenSelector);

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <FastImage
        source={{uri, headers: {Authorization: 'Bearer ' + token}}}
        style={{
          width: mainSize.width * (desiredHeight / mainSize.height),
          maxWidth: '100%',
          height: desiredHeight,
          marginBottom: px(7.5),
          marginRight: px(2.5),
        }}
        resizeMode="contain"
      />
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: px(10),
  },
});

const messageImagesSelector = createSelector(
  (message: Message) => message,
  message => message.files && message.files.filter(file => file.mimetype.startsWith('image')),
);

const mapStateToProps = (state: RootState, ownProps) => {
  const message = state.entities.messages.byId[ownProps.messageId];
  return {
    images: ownProps.images ?? messageImagesSelector(message),
  };
};

export default connect(mapStateToProps)(MessageImages);
