import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createBrowserApp} from '@react-navigation/web';
import {NavigationActions} from 'react-navigation';
import isNative from '../utils/isNative';
import Main from '../screens/Main';
import ChatUI from '../screens/ChatUI';
import Auth from '../screens/Auth';
import UserProfile from '../screens/UserProfile';

const AppStack = createStackNavigator(
  {
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    Main,
    ChatUI,
    Auth,
    UserProfile,
  },
  {
    headerMode: 'none',
    initialRouteName: 'Main',
    cardStyle: {
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
  },
);

export default isNative()
  ? createAppContainer(AppStack)
  : createBrowserApp(AppStack);

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName, params?) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    }),
  );
}
export const NavigationService = {
  setTopLevelNavigator,
  navigate,
};
