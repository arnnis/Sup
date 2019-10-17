import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import {Video} from 'expo-av';
import VideoThumbnail from 'expo-video-thumbnails';
import FastImage from 'react-native-fast-image';
import {createSelector} from 'reselect';
import {Message} from '../../models';
import {RootState} from '../../reducers';
import {connect} from 'react-redux';
import px from '../../utils/normalizePixel';
import {currentTeamTokenSelector} from './MessageImages';

type Props = ReturnType<typeof mapStateToProps> & {
  messageId: string;
};

class MessageVideos extends Component<Props> {
  render() {
    let {videos} = this.props;
    if (!videos || !videos.length) return null;

    let width = '100%';
    let height = px(200);
    if (videos.length > 1) {
      width = '50%';
      height = px(125);
    }
    return (
      <View style={styles.container}>
        {videos.map(video => (
          <MessageVideo
            uri={video.url_private_download}
            width={width}
            height={height}
            token={this.props.token}
          />
        ))}
      </View>
    );
  }
}

type MessageVideoProps = {
  uri: string;
  width: string | number;
  height: string | number;
  token: string;
};

class MessageVideo extends Component<MessageVideoProps> {
  state = {
    thumbnail: '',
  };
  video: Video | null = null;

  componentDidMount() {
    this.generateThumbnail();
  }

  async componentWillUnmount() {
    if (this.video) {
      await this.video.stopAsync();
      await this.video.unloadAsync();
    }
  }

  generateThumbnail = async () => {
    let {token, uri} = this.props;
    try {
      const {uri: thumbnailUri} = await VideoThumbnail.getThumbnailAsync(uri, {
        time: 15000,
        headers: {Authorization: 'Bearer ' + token},
      });
      this.setState({thumbnail: thumbnailUri});
    } catch (e) {
      console.warn(e);
    }
  };

  renderThumbnail(uri, width, height) {
    let {token} = this.props;
    let thumbnailUri = this.state.thumbnail;
    if (!thumbnailUri) return null;
    return (
      <FastImage
        source={{uri, headers: {Authorization: 'Bearer ' + token}}}
        style={{width: width, height: height, marginBottom: px(7.5)}}
        resizeMode="cover"
      />
    );
  }

  render() {
    let {token, uri, height, width} = this.props;
    return this.renderThumbnail(uri, width, height);
    return (
      <Video
        ref={ref => (this.video = ref)}
        source={{uri, headers: {Authorization: 'Bearer ' + token}}}
        rate={1.0}
        volume={1.0}
        isMuted={false}
        resizeMode="cover"
        style={{width, height}}
        useNativeControls
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: px(10),
  },
});

const messageVideosSelector = createSelector(
  (message: Message) => message,
  message => message.files && message.files.filter(file => file.mimetype.startsWith('video')),
);

const mapStateToProps = (state: RootState, ownProps) => ({
  videos: messageVideosSelector(state.entities.messages.byId[ownProps.messageId]),
  token: currentTeamTokenSelector(state),
});

export default connect(mapStateToProps)(MessageVideos);
