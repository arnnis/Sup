import React, {useState, FC, useEffect, useRef, useContext} from 'react';
import {View, StyleSheet, Text, ViewStyle, TextStyle} from 'react-native';
import {useSelector} from 'react-redux';
import {FileSystem as fs} from 'react-native-unimodules';
import {Audio} from 'expo-av';
import {Howl} from 'howler';
import bytes from 'bytes';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {RootState} from '../../reducers';
import {MessageAttachement} from '../../models';
import px from '../../utils/normalizePixel';
import Touchable from '../../components/Touchable';
import {currentTeamTokenSelector, meSelector} from '../../reducers/teams';
import ThemeContext from '../../contexts/theme';
import {messageFilesSelector} from '../../reducers/messages';
import {Platform} from '../../utils/platform';

interface Props {
  messageId: string;
}
// For all files (including sounds) except videos and images.
const MessageFilesList: FC<Props> = ({messageId}) => {
  const {files, isMe} = useSelector((state: RootState) => {
    let message = state.entities.messages.byId[messageId];
    return {
      files: messageFilesSelector(message),
      isMe: meSelector(state)?.id === message.user,
    };
  });

  const renderFile = (file: MessageAttachement) => <File file={file} isMe={isMe} />;

  return files ? <View style={styles.container}>{files.map(renderFile)}</View> : null;
};
interface FileProps {
  file: MessageAttachement;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  isMe?: boolean;
}

export const File: FC<FileProps> = ({file, containerStyle, textStyle, isMe}) => {
  const [url] = useState<string>(file.url_private_download);
  const {theme} = useContext(ThemeContext);
  const token = useSelector(currentTeamTokenSelector);
  const [filename, setFilename] = useState(url.split('/').pop());
  const [playing, setPlaying] = useState(false);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [localPath, setLocalPath] = useState<string>(null);
  const [isSound] = useState<boolean>(file.mimetype.startsWith('audio'));
  const downloadRef = useRef<fs.DownloadResumable>(null);
  const soundRef = useRef<Audio.Sound | Howl | null>(null);

  useEffect(() => {
    return () => {
      if (soundRef.current instanceof Audio.Sound) soundRef?.current.unloadAsync();
      if (soundRef.current instanceof Howl) soundRef.current?.unload();
      stopDownload();
    };
  });

  const handleActionButtonPress = () => {
    if (isSound) {
      playSound();
    } else {
      downloadFile();
    }
  };

  const handleDownloadProgressUpdate = (totalSizeBytes: number, progressBytes: number) => {
    setDownloadProgress((totalSizeBytes / progressBytes) * 100);
  };

  const downloadFileNative = async () => {
    if (downloading) return false;
    if (localPath) return localPath;

    let _localPath = `${fs.documentDirectory}/${filename}`;
    // let {exists} = await fs.getInfoAsync(localPath);
    // if (exists) return localPath;

    setDownloading(false);

    downloadRef.current = fs.createDownloadResumable(
      url,
      _localPath,
      {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      },
      progress =>
        handleDownloadProgressUpdate(
          progress.totalBytesWritten,
          progress.totalBytesExpectedToWrite,
        ),
    );

    await downloadRef.current.downloadAsync();

    setLocalPath(_localPath);
    setDownloading(false);
    return _localPath;
  };

  const downloadFileWeb = () => {
    // window.open(url, '_blank');
    const el = document.createElement('a');
    el.href = url;
    el.download = filename;
    el.target = '_blank';
    el.click();
  };

  const downloadFile = Platform.isNative ? downloadFileNative : downloadFileWeb;

  const playSoundNative = async () => {
    // Sound already initialized
    if (soundRef.current && soundRef.current instanceof Audio.Sound) {
      let playbackStatus = await soundRef.current.getStatusAsync();
      if (!playbackStatus.isLoaded) return;
      if (playbackStatus.isPlaying) {
        soundRef.current.pauseAsync();
      } else {
        soundRef.current.playAsync();
      }
    } else {
      let localPath = await downloadFileNative();
      if (!localPath) return false;
      let {sound} = await Audio.Sound.createAsync({uri: url}, {shouldPlay: false});
      soundRef.current = sound;

      await soundRef.current.playAsync();
      setPlaying(true);

      soundRef.current.setOnPlaybackStatusUpdate(playbackStatus => {
        if (!playbackStatus.isLoaded) {
          // Update your UI for the unloaded state
          if (playbackStatus.error) {
            console.log(`Encountered a fatal error during playback: ${playbackStatus.error}`);
            // Send Expo team the error on Slack or the forums so we can help you debug!
          }
        } else {
          if (playbackStatus.isPlaying) {
            setPlaying(true);
          } else {
            setPlaying(false);
          }

          if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
            setPlaying(false);
          }
        }
      });
    }
  };

  const playSoundWeb = async () => {
    downloadFile();
    // if (soundRef.current && soundRef.current instanceof Howl) {
    //   let playbackStatus = await soundRef.current.state();
    //   if (playbackStatus !== 'loaded') return;
    //   if (playing) {
    //     soundRef.current.pause();
    //   } else {
    //     soundRef.current.play();
    //   }
    // } else {
    //   soundRef.current = new Howl({
    //     src: [url],
    //   });
    //   soundRef.current.play();

    //   // register events
    //   soundRef.current.on('play', () => setPlaying(true));
    //   soundRef.current.on('stop', () => setPlaying(false));
    //   soundRef.current.on('pause', () => setPlaying(false));
    //   soundRef.current.on('playerror', () => setPlaying(false));
    //   soundRef.current.on('loaderror', () => setPlaying(false));
    //   soundRef.current.on('end', () => setPlaying(false));
    // }
  };

  const playSound = Platform.isNative ? playSoundNative : playSoundWeb;

  const stopDownload = () => {
    if (downloading) {
      downloadRef.current && downloadRef.current.pauseAsync();
    }
    setDownloading(false);
    setDownloadProgress(0);
  };

  const renderDownloadProgress = () => {
    return (
      <Text style={[styles.downloadProgress, this.props.isMe && {color: 'purple'}]}>
        {downloadProgress.toFixed(1) + '%'}
      </Text>
    );
  };

  const renderStopDownloadIcon = () => {
    return (
      <MaterialCommunityIcons
        name="close"
        size={px(22)}
        color={isMe ? 'purple' : '#fff'}
        style={{marginTop: px(5)}}
      />
    );
  };

  const renderPlayIcon = () => (
    <MaterialCommunityIcons name="play" size={px(26)} color={isMe ? 'purple' : '#fff'} />
  );

  const renderPauseIcon = () => (
    <MaterialCommunityIcons name="pause" size={px(26)} color={isMe ? 'purple' : '#fff'} />
  );

  const renderFileIcon = () => (
    <MaterialCommunityIcons name="file" size={px(22)} color={isMe ? 'purple' : '#fff'} />
  );

  const renderActionButton = () => (
    <Touchable
      style={[styles.actionButton, isMe && {backgroundColor: '#fff'}]}
      onPress={handleActionButtonPress}>
      {downloading ? (
        <>
          {renderStopDownloadIcon()}
          {renderDownloadProgress()}
        </>
      ) : isSound ? (
        playing ? (
          renderPauseIcon()
        ) : (
          renderPlayIcon()
        )
      ) : (
        renderFileIcon()
      )}
    </Touchable>
  );

  const renderName = () => (
    <Text
      style={[styles.fileName, {color: theme.foregroundColor}, isMe && {color: '#fff'}, textStyle]}
      numberOfLines={2}>
      {file.name}
    </Text>
  );

  const renderFileSizeAndType = () => {
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
  };

  const renderSoundWeb = () =>
    isSound &&
    Platform.isWeb && (
      <audio src={url} autoPlay={false} style={{width: '100%', height: px(25)}} controls />
    );

  return (
    <>
      <View style={[styles.file, containerStyle]}>
        {renderActionButton()}
        <View style={styles.fileInfosWrapper}>
          {renderName()}
          {renderFileSizeAndType()}
        </View>
      </View>
      {/* {renderSoundWeb()} */}
    </>
  );
};

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

export default MessageFilesList;
