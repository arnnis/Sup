import React, {FC, useContext} from 'react';
import {StyleSheet} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import DocumentPicker from 'react-native-document-picker';

import Touchable from '../../components/Touchable';
import px from '../../utils/normalizePixel';
import {Platform} from '../../utils/platform';
import ThemeContext from '../../contexts/theme';
import {openUploadDialog} from '../../actions/files';
import {RootState} from '../../reducers';

const FileUploadButton: FC = () => {
  const {theme} = useContext(ThemeContext);
  const {currentChatId, currentThreadId} = useSelector((state: RootState) => ({
    currentChatId: state.chats.currentChatId,
    currentThreadId: state.chats.currentThreadId,
  }));
  const dispatch = useDispatch();

  const openDocumentPicker = async () => {
    const params = {chatId: currentChatId, threadId: currentThreadId};
    if (Platform.isWeb) {
      const el = document.createElement('input');
      el.type = 'file';
      el.click();
      el.addEventListener('change', e => {
        // @ts-ignore
        let files = e.target.files;
        dispatch(openUploadDialog({files: files, ...params}));
      });
    } else {
      const file = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      console.log('TCL: openDocumentPicker -> file', file);
      dispatch(openUploadDialog({files: [file], ...params}));
    }
  };

  return (
    <Touchable style={styles.fileButton} onPress={openDocumentPicker}>
      <MaterialCommunityIcons name="file" size={px(20)} color={theme.foregroundColorMuted65} />
    </Touchable>
  );
};

const styles = StyleSheet.create({
  fileButton: {
    marginLeft: 'auto',
    height: '100%',
    marginBottom: Platform.select({ios: px(7.5), web: px(7.5), default: px(11)}),
    marginRight: px(10),
  },
});

export default FileUploadButton;
