import {UIManager, findNodeHandle, ActionSheetIOS, Platform} from 'react-native';

const showMenu = (
  actions: Array<{title: string; onPress(): void}>,
  anchorRef,
  destructiveButtonIndex: number | undefined = 0,
) => {
  if (Platform.OS === 'android') {
    UIManager.showPopupMenu(
      findNodeHandle(anchorRef),
      actions.map(action => action.title),
      () => {},
      (action, index) => {
        if (action === 'itemSelected') {
          actions[index].onPress();
        }
      },
    );
  } else {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancel', ...actions.map(action => action.title)],
        destructiveButtonIndex: destructiveButtonIndex,
        cancelButtonIndex: 0,
      },
      index => {
        if (index > 0) {
          // To make it same index as Android, as we do not care about Cancel action
          actions[index - 1].onPress();
        }
      },
    );
  }
};

export default showMenu;
