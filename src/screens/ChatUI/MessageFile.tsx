import React, {Component} from 'react';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import fs from 'react-native-fs';
import Sound from 'react-native-sound';
import bytes from 'bytes';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {RootState} from '../../reducers';
import {Message, MessageAttachement} from '../../models';
import {View, StyleSheet, Text, ToastAndroid, Platform} from 'react-native';
import px from '../../utils/normalizePixel';
import Touchable from '../../components/Touchable';
import {currentTeamTokenSelector} from './MessageImage';

type Props = ReturnType<typeof mapStateToProps> & {
  messageId: string;
};
// For all files (including sounds) except videos and images.
class MessageFilesList extends Component<Props> {
  render() {
    let {message, files} = this.props;
    if (!message || !files || files.length === 0) return null;
    return (
      <View style={styles.container}>
        {files.map(file => (
          <MessageFile file={file} token={this.props.token} />
        ))}
      </View>
    );
  }
}

interface MessageFileProps {
  token: string;
  file: MessageAttachement;
}

interface MessageFileState {
  uri: string;
  playing: boolean;
  downloading: boolean;
  downloadJobId: number | undefined;
  downloadProgress: number;
  localPath: string;
  isSound: boolean;
}

class MessageFile extends Component<MessageFileProps, MessageFileState> {
  constructor(props: MessageFileProps) {
    super(props);
    this.state = {
      uri: props.file.url_private,
      playing: false,
      downloading: false,
      downloadJobId: undefined,
      downloadProgress: 0,
      localPath: '',
      isSound: props.file.mimetype.startsWith('audio'),
    };
  }

  sound: Sound = null;

  componentWillUnmount() {
    this.sound && this.sound.release();
    this.stopDownload();
  }

  handleActionButtonPress = async () => {
    let {file} = this.props;
    let {isSound, uri, downloading} = this.state;
    if (downloading) {
      this.stopDownload();
    } else if (isSound) {
      // Play and Pause
      if (this.sound) {
        if (this.sound.isPlaying()) {
          this.sound.pause();
          this.setState({playing: false});
        } else {
          this.sound.play();
          this.setState({playing: true});
        }
      } else {
        let localPath = await this.downloadFile(uri);
        this.sound = new Sound(localPath, '', err => {
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
            this.setState({playing: false});
          });
          this.setState({playing: true});
        });
      }
    } else {
      await this.downloadFile(uri);
      Platform.OS === 'android' &&
        ToastAndroid.show(file.name + ' downloaded successfully', ToastAndroid.SHORT);
    }
  };

  downloadFile = async (uri: string) => {
    if (this.state.downloading) return;
    if (this.state.localPath) return this.state.localPath;

    const filename = uri.split('/').pop();
    let localPath = `${fs.DocumentDirectoryPath}/${filename}`;
    let exists = await fs.exists(localPath);
    if (exists) return localPath;

    this.setState({downloading: true});
    let {jobId, promise} = await fs.downloadFile({
      fromUrl: uri,
      toFile: localPath,
      headers: {
        Authorization: 'Bearer ' + this.props.token,
      },
      progress: res => {
        //alert(JSON.stringify(res));
        this.setState({
          downloadProgress: (res.bytesWritten / res.contentLength) * 100,
        });
      },
    });
    this.setState({downloadJobId: jobId});
    await promise;
    // console.log((await fs.readFile(localPath)) || 'empty');
    await this.setState({localPath, downloading: false});
    return localPath;
  };

  stopDownload() {
    if (this.state.downloadJobId) {
      fs.stopDownload(this.state.downloadJobId);
    }

    this.setState({downloading: false, downloadProgress: 0});
  }

  renderPlayIcon() {
    return <MaterialCommunityIcons name="play" size={px(26)} color="#fff" />;
  }

  renderPauseIcon() {
    return <MaterialCommunityIcons name="pause" size={px(26)} color="#fff" />;
  }

  renderFileIcon() {
    return <MaterialCommunityIcons name="file" size={px(22)} color="#fff" />;
  }

  renderStopDownloadIcon() {
    return (
      <MaterialCommunityIcons name="close" size={px(22)} color="#fff" style={{marginTop: px(5)}} />
    );
  }

  renderActionButton() {
    let {playing, isSound, downloading} = this.state;
    return (
      <>
        <Touchable style={styles.actionButton} onPress={() => this.handleActionButtonPress()}>
          {downloading ? (
            <>
              {this.renderStopDownloadIcon()}
              {this.renderDownloadProgress()}
            </>
          ) : isSound ? (
            playing ? (
              this.renderPauseIcon()
            ) : (
              this.renderPlayIcon()
            )
          ) : (
            this.renderFileIcon()
          )}
        </Touchable>
      </>
    );
  }

  renderDownloadProgress() {
    return (
      <Text style={styles.downloadProgress}>{this.state.downloadProgress.toFixed(1) + '%'}</Text>
    );
  }

  renderName() {
    let {file} = this.props;
    return (
      <Text style={styles.fileName} numberOfLines={2}>
        {file.name}
      </Text>
    );
  }

  renderFileSizeAndType() {
    let {file} = this.props;
    return (
      <Text style={styles.fileSizeAndType}>
        {bytes(file.size)} {file.filetype.toUpperCase()}
      </Text>
    );
  }

  render() {
    return (
      <View style={styles.file}>
        {this.renderActionButton()}
        <View style={styles.fileInfosWrapper}>
          {this.renderName()}
          {this.renderFileSizeAndType()}
        </View>
      </View>
    );
  }
}

const ACTION_BUTTON_SIZE = px(45);

const styles = StyleSheet.create({
  container: {
    width: px(200),
  },
  file: {
    minHeight: ACTION_BUTTON_SIZE,
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
  fileInfosWrapper: {
    flex: 1,
    marginHorizontal: px(10),
    justifyContent: 'space-between',
    marginBottom: px(2.5),
  },
  fileName: {
    fontSize: px(14),
    color: '#fff',
    fontWeight: 'bold',
  },
  fileSizeAndType: {
    fontSize: px(12),
    color: '#fff',
    marginTop: px(5),
  },
  downloadProgress: {
    fontWeight: 'bold',
    fontSize: px(12),
    color: '#fff',
    textAlign: 'center',
    marginBottom: px(5),
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
