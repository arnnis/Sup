import React, {FC, useContext} from 'react';
import {StyleSheet} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import DocumentPicker from 'react-native-document-picker';

import Touchable from '../../components/Touchable';
import px from '../../utils/normalizePixel';
import {Platform} from '../../utils/platform';
import ThemeContext from '../../contexts/theme';
import {openUploadDialog} from '../../slices/files-slice';

interface Props {
  chatId: string;
  threadId?: string;
}

const FileUploadButton: FC<Props> = ({chatId, threadId}) => {
  const {theme} = useContext(ThemeContext);
  const dispatch = useDispatch();

  const openDocumentPicker = async () => {
    const params = {chatId, threadId};
    if (Platform.isWeb) {
      const el = document.createElement('input');
      el.type = 'file';
      el.click();
      el.addEventListener('change', (e) => {
        // @ts-ignore
        let files = e.target.files;
        dispatch(openUploadDialog({params: {files: files, ...params}}));
      });
    } else {
      const file = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      console.log('TCL: openDocumentPicker -> file', file);
      dispatch(openUploadDialog({params: {files: [file], ...params}}));
    }
  };

  return (
    <Touchable style={styles.fileButton} onPress={openDocumentPicker}>
      <MaterialCommunityIcons name="paperclip" size={px(20)} color={theme.foregroundColorMuted65} />
    </Touchable>
  );
};

const styles = StyleSheet.create({
  fileButton: {
    marginLeft: 'auto',
    height: '100%',
    marginBottom: Platform.select({ios: px(7.5), web: px(9), default: px(11)}),
    marginRight: px(10),
  },
});

export default FileUploadButton;
