import React, {Component} from 'react';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import fs from 'react-native-fs';
import Sound from 'react-native-sound';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {RootState} from '../../reducers';
import {Message, MessageAttachement} from '../../models';
import {View, StyleSheet, Text} from 'react-native';
import px from '../../utils/normalizePixel';
import Touchable from '../../components/Touchable';
import {currentTeamTokenSelector} from './MessageImage';

type Props = ReturnType<typeof mapStateToProps> & {
  messageId: string;
};

interface State {
  currentPlaying: string;
  currentDownloading: string;
  downloadProgress: {[fileURI: string]: number};
  downloadedFilePath: {[fileURI: string]: string};
}

// For all files (including sounds) except videos and images.
class MessageFilesList extends Component<Props, State> {
  state: State = {
    currentPlaying: '', // file uri
    currentDownloading: '', // file uri
    downloadProgress: {},
    downloadedFilePath: {},
  };
  sound: Sound = null;

  componentWillUnmount() {
    this.sound && this.sound.release();
  }

  handleActionButtonPress = async (uri: string, isSound: boolean) => {
    debugger;
    if (isSound) {
      // Play and Pause
      debugger;
      if (this.state.currentPlaying === uri) {
        if (this.sound) {
          if (this.sound.isPlaying()) this.sound.pause();
          else this.sound.play();
        }
      } else {
        let localPath = await this.downloadFile(uri);
        debugger;
        this.sound = new Sound(localPath, '', err => {
          debugger;
          if (err) {
            console.log('failed to load the sound', err);
            return;
          }
          console.log(
            'duration in seconds: ' +
              this.sound.getDuration() +
              'number of channels: ' +
              this.sound.getNumberOfChannels(),
          );
          this.sound.play(() => {
            this.setState({currentPlaying: ''});
          });
          this.setState({currentPlaying: uri});
        });
      }
    } else {
      this.downloadFile(uri);
    }
  };

  downloadFile = async (uri: string) => {
    if (this.state.downloadedFilePath[uri]) return this.state.downloadedFilePath[uri];

    const filename = uri.split('/').pop();
    let localPath = `${fs.DocumentDirectoryPath}/${filename}`;
    let exists = await fs.exists(localPath);
    if (exists) return localPath;

    this.setState({currentDownloading: uri});
    let res = await fs.downloadFile({
      fromUrl: uri,
      toFile: localPath,
      headers: {
        Authorization: 'Bearer ' + this.props.token,
      },
      progress: res => {
        //alert(JSON.stringify(res));
        this.setState({
          downloadProgress: {
            ...this.state.downloadProgress,
            [uri]: (res.bytesWritten / res.contentLength) * 100,
          },
        });
      },
    }).promise;
    // console.log((await fs.readFile(localPath)) || 'empty');
    await this.setState({downloadedFilePath: {...this.state.downloadedFilePath, [uri]: localPath}});
    return localPath;
  };

  renderPlayIcon() {
    return <MaterialCommunityIcons name="play" size={px(26)} color="#fff" />;
  }

  renderPauseIcon() {
    return <MaterialCommunityIcons name="pause" size={px(26)} color="#fff" />;
  }

  renderFileIcon() {
    return <MaterialCommunityIcons name="file" size={px(26)} color="#fff" />;
  }

  renderStopDownloadIcon() {
    return <MaterialCommunityIcons name="close" size={px(26)} color="#fff" />;
  }

  renderActionButton(uri: string, isSound: boolean) {
    let isPlaying = this.state.currentPlaying === uri;
    return (
      <Touchable
        style={styles.actionButton}
        onPress={() => this.handleActionButtonPress(uri, isSound)}>
        {isSound
          ? isPlaying
            ? this.renderPauseIcon()
            : this.renderPlayIcon()
          : this.renderFileIcon()}
      </Touchable>
    );
  }

  renderFile(file: MessageAttachement) {
    let isSound = file.mimetype.startsWith('audio');
    let uri = file.url_private;
    return (
      <View style={styles.file}>
        {this.renderActionButton(uri, isSound)}
        {this.renderDownloadProgress(uri)}
      </View>
    );
  }

  renderDownloadProgress(uri) {
    return <Text style={{color: '#fff'}}>{this.state.downloadProgress[uri]} %</Text>;
  }

  render() {
    let {message, files} = this.props;
    if (!message || !files || files.length === 0) return null;
    return <View style={styles.container}>{files.map(file => this.renderFile(file))}</View>;
  }
}

const ACTION_BUTTON_SIZE = px(45);

const styles = StyleSheet.create({
  container: {
    width: px(200),
  },
  file: {
    height: ACTION_BUTTON_SIZE,
    flexDirection: 'row',
  },
  actionButton: {
    height: ACTION_BUTTON_SIZE,
    width: ACTION_BUTTON_SIZE,
    borderRadius: ACTION_BUTTON_SIZE / 2,
    backgroundColor: 'purple',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const messageFilesSelector = createSelector(
  (message: Message) => message,
  message =>
    message.files &&
    message.files.filter(
      file => !file.mimetype.startsWith('image') && !file.mimetype.startsWith('video'),
    ),
);

const mapStateToProps = (state: RootState, ownProps) => {
  let message = state.entities.messages.byId[ownProps.messageId];
  return {
    message,
    files: messageFilesSelector(message),
    token: currentTeamTokenSelector(state),
  };
};

export default connect(mapStateToProps)(MessageFilesList);
