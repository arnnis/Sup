import React, {Component, FC, useState, useEffect} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import FastImage from 'react-native-fast-image';
import {RootState} from '../../reducers';
import {createSelector} from 'reselect';
import {Message, MessageAttachement} from '../../models';
import px from '../../utils/normalizePixel';
import {connect, useSelector} from 'react-redux';
import {currentTeamTokenSelector} from '../../reducers/teams';

type Props = ReturnType<typeof mapStateToProps> & {
  messageId: string;
};

class MessageImages extends Component<Props> {
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
    return <MessageImage uri={uri} desiredHeight={desiredHeight} mainSize={mainSize} />;
  }

  render() {
    let {images} = this.props;
    if (!images) return null;

    const isSingle = !images.length;

    return (
      <View style={styles.container}>{images.map(image => this.renderImage(image, isSingle))}</View>
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
}

const MessageImage: FC<MessageImage> = ({uri, desiredHeight, mainSize}) => {
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
