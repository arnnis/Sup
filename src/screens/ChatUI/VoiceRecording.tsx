import React, {FC, useContext, useEffect} from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import px from '../../utils/normalizePixel';
import ThemeContext from '../../contexts/theme';

const VoiceRecording: FC = () => {
  const {theme} = useContext(ThemeContext);

  let shouldStop = false;
  let stopped = false;

  useEffect(() => {
    recordVoiceWeb();
    return () => {
      console.log('reached here');
      shouldStop = true;
    };
  });

  const recordVoiceWeb = () => {
    navigator.mediaDevices.getUserMedia({audio: true, video: false}).then((stream) => {
      console.log(stream);
      const options = {mimeType: 'audio/webm'};
      const recordedChunks: any[] | undefined = [];
      const mediaRecorder = new MediaRecorder(stream, options);

      mediaRecorder.addEventListener('dataavailable', function (e) {
        console.log('voice-data', e);
        if (e.data.size > 0) {
          recordedChunks.push(e.data);
        }

        if (shouldStop === true && stopped === false) {
          mediaRecorder.stop();
          stopped = true;
        }
      });

      mediaRecorder.addEventListener('stop', function () {
        const blob = new Blob(recordedChunks);
        console.log('voice-blob', blob);
        // downloadLink.href = URL.createObjectURL();
        // downloadLink.download = 'acetest.wav';
      });

      mediaRecorder.start();
    });
  };

  const renderTimer = () => (
    <View style={styles.timerContainer}>
      <MaterialCommunityIcons
        name="checkbox-blank-circle"
        size={px(19)}
        color={theme.backgroundColorLess5}
        style={Platform.select({
          android: {marginLeft: px(2.5)},
          default: {marginLeft: px(2.5), marginTop: px(2.5)},
        })}
      />
      <Text style={[styles.timerText, {color: theme.backgroundColorLess5}]}>12:05:03</Text>
    </View>
  );

  const renderStopRecordingText = () => (
    <View style={styles.stopTextContainer}>
      <Text style={{color: theme.backgroundColorLess5}}>Click to stop recording...</Text>
    </View>
  );

  return (
    <View style={[styles.container, {backgroundColor: theme.backgroundColorLighther1}]}>
      {renderTimer()}
      {renderStopRecordingText()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: px(50),
  },
  timerContainer: {
    marginLeft: px(15),
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontSize: px(12.5),
    marginLeft: px(7.5),
    fontWeight: '500',
  },
  stopTextContainer: {
    marginRight: 'auto',
    marginLeft: 'auto',
    height: '100%',

    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default VoiceRecording;
