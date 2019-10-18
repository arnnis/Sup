import {UIManager, findNodeHandle, ActionSheetIOS, Platform} from 'react-native';

const showMenu = (actions: Array<string>, anchorRef, destructiveButtonIndex: number) => {
  if (Platform.OS === 'android') {
    UIManager.showPopupMenu(
      findNodeHandle(anchorRef),
      actions,
      () => {},
      (action, index) => {
        if (action === 'itemSelected') {
          this.props.onPress(index);
        }
      },
    );
  } else {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['cancel', ...actions],
        destructiveButtonIndex: destructiveButtonIndex,
        cancelButtonIndex: 0,
      },
      index => {
        if (index > 0) {
          // To make it same index as Android, as we do not care about Cancel action
          this.props.onPress(index - 1);
        }
      },
    );
  }
};

export default showMenu;
