import React, {Component, FC, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
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

type Props = ReturnType<typeof mapStateToProps> & {
  messageId: string;
};

class MessageImages extends Component<Props> {
  state = {
    imageViewerVisible: false,
  };

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
    let {images, token} = this.props;
    if (!images) return null;

    const isSingle = !images.length;

    return (
      <>
        <View style={styles.container}>
          {images.map(image => this.renderImage(image, isSingle))}
        </View>
        <Modal
          visible={this.state.imageViewerVisible}
          transparent
          animationType="fade"
          style={{margin: 0}}>
          <ImageViewer
            imageUrls={images.map(img => ({
              url: img.url_private_download,
              props: {headers: {Authorization: 'Bearer ' + token}},
            }))}
            onCancel={() => this.setState({imageViewerVisible: false})}
            loadingRender={() => <ActivityIndicator size="large" color="#fff" />}
            enableSwipeDown
            onSwipeDown={() => this.setState({imageViewerVisible: false})}
          />
          <Touchable
            onPress={() => this.setState({imageViewerVisible: false})}
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

const MessageImage: FC<MessageImage> = ({uri, desiredHeight, mainSize, onPress}) => {
  // let [size, setSize] = useState({width: 1, height: 1});
  let token = useSelector(currentTeamTokenSelector);
  // useEffect(() => {
  //   Image.getSizeWithHeaders(uri, {Authorization: 'Bearer ' + token}, (width, height) => {
  //     console.log('fetched width:', width, 'fetched height: ', height);
  //     setSize({width, height});
  //   });
  // }, []);
  console.log('fetched size:', mainSize);
  console.log(
    'width:',
    mainSize.width * (desiredHeight / mainSize.height),
    'height: ',
    desiredHeight,
  );

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
    images: messageImagesSelector(message),
    token: currentTeamTokenSelector(state),
  };
};

export default connect(mapStateToProps)(MessageImages);
