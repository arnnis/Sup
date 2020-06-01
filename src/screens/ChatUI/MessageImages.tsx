import React, {Component, FC} from 'react';
import {View, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import FastImage from 'react-native-fast-image';
import {RootState} from '../../reducers';
import {createSelector} from 'reselect';
import {Message, MessageAttachement} from '../../models';
import px from '../../utils/normalizePixel';
import {connect, useSelector} from 'react-redux';
import {currentTeamTokenSelector} from '../../slices/teams-slice';
import ImagesPreview from './ImagesPreview';
import {Platform} from '../../utils/platform';

type Props = ReturnType<typeof mapStateToProps> & {
  messageId: string;
};

class MessageImages extends Component<Props> {
  state = {
    imageViewerOpen: false,
    imageViewerCurrentImageIndex: 0,
  };

  handlePreviewDismiss = () => this.setState({imageViewerOpen: false});

  renderImage = (image: MessageAttachement) => {
    let {images} = this.props;
    let desiredHeight: number, uri: string, mainSize: {width: number; height: number};

    let isSingle = !images.length;

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
        onPress={() =>
          this.setState({
            imageViewerOpen: true,
            imageViewerCurrentImageIndex: images.map((image) => image.id).indexOf(image.id),
          })
        }
      />
    );
  };

  render() {
    let {images} = this.props;
    if (!images) return null;

    return (
      <>
        <View style={styles.container}>{images.map(this.renderImage)}</View>
        <ImagesPreview
          open={this.state.imageViewerOpen}
          images={images}
          onDismiss={this.handlePreviewDismiss}
          initalIndex={this.state.imageViewerCurrentImageIndex}
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

  // On web slack returns cors errors. This is a workaround to fetch the image using a server
  uri = !Platform.isWeb
    ? uri
    : encodeURI(`http://slack-img-cors-bypass.herokuapp.com/url?url=${uri}&t=${'Bearer ' + token}`);

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <FastImage
        source={{uri, headers: {Authorization: 'Bearer ' + token}}}
        style={{
          width: mainSize.width ? mainSize.width * (desiredHeight / mainSize.height) : 'auto',
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
  (message) => message.files && message.files.filter((file) => file.mimetype.startsWith('image')),
);

const mapStateToProps = (state: RootState, ownProps) => {
  const message = state.entities.messages.byId[ownProps.messageId];
  return {
    images: messageImagesSelector(message),
  };
};

export default connect(mapStateToProps)(MessageImages);
