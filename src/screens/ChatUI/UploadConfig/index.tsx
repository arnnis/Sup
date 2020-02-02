import React, {FC, useState, useEffect, useContext} from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import Screen from '../../../components/Screen';
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

interface NativeFile {
  uri: string;
}

interface Props {
  files: File[];
}

interface UploadFile {
  uri: string;
  origin: File;
}

const UploadConfig: FC<Props> = ({files}) => {
  const [caption, setCaption] = useState('');
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const {theme} = useContext(ThemeContext);

  useEffect(() => {
    (async () => {
      setUploadFiles(await normalizeFiles(files));
    })();
  }, []);

  const normalizeFiles = async (files: File[]): Promise<UploadFile[]> => {
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
      <View style={[styles.fileWrapper, {backgroundColor: theme.backgroundColorLess1}]}>
        <UploadImage uri={uri} />
      </View>
    );
  };

  const renderComposer = () => {
    return (
      <View style={[styles.composerWrapper, {backgroundColor: theme.backgroundColorLess1}]}>
        <Composer text={caption} onTextChanged={setCaption} />
        <EmojiButton onEmojiSelected={handleEmojiSelected} />
      </View>
    );
  };

  const renderDivider = () => (
    <View style={[styles.divider, {backgroundColor: theme.backgroundColorLess1}]} />
  );

  return (
    <UploadDropZoneWeb onDrop={handleFileDropWeb} placeholder="Drop to add Item">
      <Screen>
        <Header center="Upload File" />
        <View style={styles.container}>
          <ScrollView>{uploadFiles.map(renderFile)}</ScrollView>
          {renderDivider()}
          {renderComposer()}
        </View>
      </Screen>
    </UploadDropZoneWeb>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: px(20),
    paddingRight: px(20),
    paddingTop: px(10),
    paddingBottom: px(20),
  },
  composerWrapper: {
    height: px(125),
    flexDirection: 'row',
    borderRadius: px(10),
    alignItems: 'flex-start',
    paddingVertical: px(10),
    paddingHorizontal: px(10),
  },
  fileWrapper: {
    borderRadius: px(10),
    padding: px(7.5),
    alignItems: 'center',
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
