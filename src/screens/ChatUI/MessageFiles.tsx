import React, {Component} from 'react';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {FileSystem as fs} from 'react-native-unimodules';
import {Audio} from 'expo-av';
import bytes from 'bytes';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {RootState} from '../../reducers';
import {Message, MessageAttachement} from '../../models';
import {View, StyleSheet, Text, ToastAndroid, Platform, ViewStyle, TextStyle} from 'react-native';
import px from '../../utils/normalizePixel';
import Touchable from '../../components/Touchable';
import {currentTeamTokenSelector} from '../../reducers/teams';

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
  containerStyle?: ViewStyle;
  textStyle: TextStyle;
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

export class MessageFile extends Component<MessageFileProps, MessageFileState> {
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

  download: fs.DownloadResumable = null;
  sound: Audio.Sound = null;

  componentWillUnmount() {
    this.sound && this.sound.unloadAsync();
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
        let playbackStatus = await this.sound.getStatusAsync();
        if (!playbackStatus.isLoaded) return;
        if (playbackStatus.isPlaying) {
          this.sound.pauseAsync();
        } else {
          this.sound.playAsync();
        }
      } else {
        let localPath = await this.downloadFile(uri);
        let {sound} = await Audio.Sound.createAsync({uri: localPath}, {shouldPlay: false});
        this.sound = sound;

        await this.sound.playAsync();
        this.setState({playing: true});

        this.sound.setOnPlaybackStatusUpdate(playbackStatus => {
          if (!playbackStatus.isLoaded) {
            // Update your UI for the unloaded state
            if (playbackStatus.error) {
              console.log(`Encountered a fatal error during playback: ${playbackStatus.error}`);
              // Send Expo team the error on Slack or the forums so we can help you debug!
            }
          } else {
            if (playbackStatus.isPlaying) {
              this.setState({playing: true});
            } else {
              this.setState({playing: false});
            }

            if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
              this.setState({playing: false});
            }
          }
        });
      }
    } else {
      await this.downloadFile(uri);
      Platform.OS === 'android' &&
        ToastAndroid.show(file.name + ' downloaded successfully', ToastAndroid.SHORT);
    }
  };

  downloadFile = async (url: string) => {
    if (this.state.downloading) return;
    if (this.state.localPath) return this.state.localPath;

    const filename = url.split('/').pop();
    let localPath = `${fs.documentDirectory}/${filename}`;
    // let {exists} = await fs.getInfoAsync(localPath);
    // if (exists) return localPath;

    this.setState({downloading: true});

    this.download = fs.createDownloadResumable(
      url,
      localPath,
      {
        headers: {
          Authorization: 'Bearer ' + this.props.token,
        },
      },
      progress => {
        //alert(JSON.stringify(res));
        this.setState({
          downloadProgress: (progress.totalBytesWritten / progress.totalBytesExpectedToWrite) * 100,
        });
      },
    );

    await this.download.downloadAsync();
    // console.log((await fs.readFile(localPath)) || 'empty');
    await this.setState({localPath, downloading: false});
    return localPath;
  };

  stopDownload() {
    if (this.state.downloading) {
      this.download && this.download.pauseAsync();
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
    let {file, textStyle} = this.props;
    return (
      <Text style={[styles.fileName, textStyle]} numberOfLines={2}>
        {file.name}
      </Text>
    );
  }

  renderFileSizeAndType() {
    let {file, textStyle} = this.props;
    return (
      <Text style={[styles.fileSizeAndType, textStyle]}>
        {bytes(file.size)} {file.filetype.toUpperCase()}
      </Text>
    );
  }

  render() {
    return (
      <View style={[styles.file, this.props.containerStyle]}>
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
