import React, {FC, useState, useEffect, useContext, useRef} from 'react';
import {StyleSheet, View, ScrollView, TouchableWithoutFeedback} from 'react-native';
import {Portal} from 'react-native-paper';
import * as Animateable from 'react-native-animatable';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {File as _File} from '../MessageFiles';
import {MessageAttachement} from '../../../models';
import withTheme from '../../../contexts/theme/withTheme';
import Composer from '../Composer';
import px from '../../../utils/normalizePixel';
import {Platform} from '../../../utils/platform';
import UploadDropZoneWeb from '../UploadDropZoneWeb';
import EmojiButton from '../EmojiButton';
import {EmojiData} from 'emoji-mart';
import UploadImage from './UploadImage';
import ThemeContext from '../../../contexts/theme';
import Header from '../../../components/Header';
import {useSelector, useDispatch} from 'react-redux';
import {RootState} from '../../../reducers';
import Touchable from '../../../components/Touchable';
import {useMediaQuery} from 'react-responsive';
import {closeUploadDialog} from '../../../actions/files';
import Send from '../Send';
import {uploadFileWeb} from '../../../actions/files/thunks';

interface NativeFile {
  uri: string;
}

interface Props {}

interface UploadFile {
  uri: string;
  origin: File;
}

const UploadConfig: FC<Props> = () => {
  const [caption, setCaption] = useState('');
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const {theme} = useContext(ThemeContext);
  const dispatch = useDispatch();
  const isLandscape = useMediaQuery({orientation: 'landscape'});
  const {open, params} = useSelector((state: RootState) => state.files.uploadDialog);
  const containerRef = useRef<Animateable.View>(null);
  const files = params && params.files;

  useEffect(() => {
    (async () => {
      setUploadFiles(await normalizeFiles(files));
    })();
  }, []);

  useEffect(() => {
    containerRef.current?.fadeInUp();
    (async () => {
      setUploadFiles(await normalizeFiles(files));
    })();
    setCaption('');
  }, [open]);

  const normalizeFiles = async (files: File[]): Promise<UploadFile[]> => {
    if (!files) return null;
    const temp: UploadFile[] = [];
    for (let file of files) {
      let uri = file.path;
      if (Platform.isWeb && file.type.startsWith('image')) {
        uri = await convertFileToDataURI(file);
      }
      temp.push({uri, origin: file});
    }
    return temp;
  };

  const convertFileToDataURI = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      try {
        const fr = new FileReader();
        fr.onload = function() {
          resolve(fr.result as string);
        };
        fr.readAsDataURL(file);
      } catch (err) {
        reject(err);
      }
    });

  const handleFileDropWeb = async (files: File[]) => {
    setUploadFiles([...uploadFiles, ...(await normalizeFiles(files))]);
  };

  const handleEmojiSelected = (emoji: EmojiData) => setCaption(caption + emoji.native);

  const closeDialog = () => dispatch(closeUploadDialog());

  const handleSendPress = () => {
    dispatch(uploadFileWeb(uploadFiles[0].origin, ['CMQ9CLVNV']));
    dispatch(closeUploadDialog());
  };

  const renderFile = (file: UploadFile) => {
    if (file.origin.type.startsWith('image')) return renderImage(file.uri);

    const File = withTheme(_File);
    const _messageFile: MessageAttachement = {
      name: file.origin.name,
      url_private_download: file.origin.path,
      mimetype: file.origin.type,
      filetype: file.origin.type,
      size: file.origin.size,
    };

    return (
      <View style={[styles.fileWrapper, {backgroundColor: theme.backgroundColorLess1}]}>
        <File file={_messageFile} />
      </View>
    );
  };

  const renderImage = (uri: string) => {
    return (
      <View
        style={[
          styles.fileWrapper,
          {backgroundColor: theme.backgroundColorLess1, alignItems: 'center'},
        ]}>
        <UploadImage uri={uri} />
      </View>
    );
  };

  const renderComposer = () => {
    return (
      <View style={[styles.composerWrapper, {backgroundColor: theme.backgroundColorLess1}]}>
        <EmojiButton onEmojiSelected={handleEmojiSelected} />
        <Composer text={caption} onTextChanged={setCaption} />

        <Send onPress={handleSendPress} />
      </View>
    );
  };

  const renderDivider = () => (
    <View style={[styles.divider, {backgroundColor: theme.backgroundColorLess1}]} />
  );

  if (!open) return null;

  const right = (
    <Touchable
      // style={styles.button}
      onPress={closeDialog}>
      <MaterialCommunityIcons name="close" color="#fff" size={px(22)} />
    </Touchable>
  );

  return (
    <Portal>
      <TouchableWithoutFeedback onPress={closeDialog}>
        <View style={StyleSheet.absoluteFill} />
      </TouchableWithoutFeedback>
      <View pointerEvents="box-none" style={styles.dialogContainer}>
        <Animateable.View
          ref={containerRef}
          style={{
            width: isLandscape ? px(350) : '95%',
            minHeight: px(150),
            maxHeight: '90%',
            backgroundColor: theme.backgroundColor,
            borderRadius: px(10),
          }}>
          <Header
            center="Upload File"
            right={right}
            style={{borderTopRightRadius: px(10), borderTopLeftRadius: px(10)}}
          />
          <View style={styles.container}>
            <ScrollView>
              <UploadDropZoneWeb
                onDrop={handleFileDropWeb}
                placeholder="Drop to add Item"
                style={{margin: 0}}>
                {uploadFiles?.map(renderFile)}
              </UploadDropZoneWeb>
            </ScrollView>
            {renderDivider()}
            {renderComposer()}
          </View>
        </Animateable.View>
      </View>
    </Portal>
  );
};

const styles = StyleSheet.create({
  dialogContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    ...(Platform.isWeb && {backdropFilter: 'blur(2px)'}),
  },
  container: {
    paddingLeft: px(20),
    paddingRight: px(20),
    paddingTop: px(10),
    paddingBottom: px(20),
    flex: 1,
  },
  composerWrapper: {
    height: px(125),
    flexDirection: 'row',
    borderRadius: px(10),
    alignItems: 'flex-start',
    paddingVertical: px(10),
    paddingRight: px(10),
    marginTop: 'auto',
  },
  fileWrapper: {
    borderRadius: px(10),
    padding: px(7.5),
    alignItems: 'flex-start',
    marginTop: px(10),
  },
  divider: {
    height: px(1),
    width: '95%',
    marginHorizontal: 'auto',
    marginVertical: px(20),
  },
});

export default UploadConfig;
