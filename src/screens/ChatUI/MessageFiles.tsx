import React, {Component} from 'react';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {FileSystem as fs} from 'react-native-unimodules';
import {Audio} from 'expo-av';
import bytes from 'bytes';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import electronDL from 'electron-dl';
import {BrowserWindow, app} from 'electron';

import {RootState} from '../../reducers';
import {Message, MessageAttachement} from '../../models';
import {View, StyleSheet, Text, ToastAndroid, ViewStyle, TextStyle} from 'react-native';
import px from '../../utils/normalizePixel';
import Touchable from '../../components/Touchable';
import {currentTeamTokenSelector, meSelector} from '../../reducers/teams';
import withTheme, {ThemeInjectedProps} from '../../contexts/theme/withTheme';
import {Platform} from '../../utils/platform';

type Props = ReturnType<typeof mapStateToProps> &
  ThemeInjectedProps & {
    messageId: string;
  };
// For all files (including sounds) except videos and images.
class MessageFilesList extends Component<Props> {
  render() {
    let {message, files, isMe} = this.props;
    if (!message || !files || files.length === 0) return null;
    let _File = withTheme(File);
    return (
      <View style={styles.container}>
        {files.map(file => (
          <_File file={file} token={this.props.token} isMe={isMe} />
        ))}
      </View>
    );
  }
}

type FileProps = ThemeInjectedProps & {
  token: string;
  file: MessageAttachement;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  isMe?: boolean;
};

interface FileState {
  uri: string;
  playing: boolean;
  downloading: boolean;
  downloadJobId: number | undefined;
  downloadProgress: number;
  localPath: string;
  isSound: boolean;
}

export class File extends Component<FileProps, FileState> {
  constructor(props: FileProps) {
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

    if (Platform.isElectron) {
      this.setState({downloading: true});
      const win = BrowserWindow.getFocusedWindow();
      await electronDL.download(win, uri, {
        onProgress: ({totalBytes, transferredBytes}) =>
          this.handleDownloadProgress(totalBytes, transferredBytes),
        directory: app.getPath('downloads') + '/Sup/',
      });
      this.setState({downloading: false});
      return;
    }

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
        let localPath = await this.downloadFileNative(uri);
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
      await this.downloadFileNative(uri);
      Platform.OS === 'android' &&
        ToastAndroid.show(file.name + ' downloaded successfully', ToastAndroid.SHORT);
    }
  };

  handleDownloadProgress = (totalSizeBytes: number, progressBytes: number) =>
    this.setState({
      downloadProgress: (totalSizeBytes / progressBytes) * 100,
    });

  downloadFileNative = async (url: string) => {
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
      progress =>
        this.handleDownloadProgress(progress.totalBytesWritten, progress.totalBytesExpectedToWrite),
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
    let {isMe} = this.props;
    return <MaterialCommunityIcons name="play" size={px(26)} color={isMe ? 'purple' : '#fff'} />;
  }

  renderPauseIcon() {
    let {isMe} = this.props;
    return <MaterialCommunityIcons name="pause" size={px(26)} color={isMe ? 'purple' : '#fff'} />;
  }

  renderFileIcon() {
    let {isMe} = this.props;
    return <MaterialCommunityIcons name="file" size={px(22)} color={isMe ? 'purple' : '#fff'} />;
  }

  renderStopDownloadIcon() {
    let {isMe} = this.props;
    return (
      <MaterialCommunityIcons
        name="close"
        size={px(22)}
        color={isMe ? 'purple' : '#fff'}
        style={{marginTop: px(5)}}
      />
    );
  }

  renderActionButton() {
    let {playing, isSound, downloading} = this.state;
    let {isMe} = this.props;
    return (
      <>
        <Touchable
          style={[styles.actionButton, isMe && {backgroundColor: '#fff'}]}
          onPress={this.handleActionButtonPress}>
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
      <Text style={[styles.downloadProgress, this.props.isMe && {color: 'purple'}]}>
        {this.state.downloadProgress.toFixed(1) + '%'}
      </Text>
    );
  }

  renderName() {
    let {file, textStyle, theme, isMe} = this.props;
    return (
      <Text
        style={[
          styles.fileName,
          {color: theme.foregroundColor},
          isMe && {color: '#fff'},
          textStyle,
        ]}
        numberOfLines={2}>
        {file.name}
      </Text>
    );
  }

  renderFileSizeAndType() {
    let {file, textStyle, theme, isMe} = this.props;
    return (
      <Text
        style={[
          styles.fileSizeAndType,
          {color: theme.foregroundColor},
          isMe && {color: '#fff'},
          textStyle,
        ]}>
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
    isMe: meSelector(state)?.id === message.user,
  };
};

export default connect(mapStateToProps)(withTheme(MessageFilesList));
