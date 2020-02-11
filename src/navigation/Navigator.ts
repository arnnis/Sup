import {createAppContainer, NavigationContainer} from 'react-navigation';
import createNativeStackNavigator from 'react-native-screens/createNativeStackNavigator';
import {createBrowserApp} from '@react-navigation/web';
import {NavigationActions} from 'react-navigation';
import isNative from '../utils/isNative';
import Main from '../screens/Main';
import ChatUI from '../screens/ChatUI';
import Auth from '../screens/Auth';
import UserProfile from '../screens/UserProfile';
import ChannelDetails from '../screens/ChannelDetails';
import SelectTheme from '../screens/SelectTheme';
import {Platform} from 'react-native';
import {createStackNavigator} from 'react-navigation-stack';

const _createStackNavigator = Platform.select({
  ios: createNativeStackNavigator,
  default: createStackNavigator,
});

const AppStack = _createStackNavigator(
  {
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    Main,
    ChatUI,
    Auth,
    UserProfile,
    ChannelDetails,
    SelectTheme,
  },
  {
    mode: 'modal',
    headerMode: 'none',
    initialRouteName: 'Main',
    cardStyle: {
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
  },
);

export default isNative() ? createAppContainer(AppStack) : createBrowserApp(AppStack);

let _navigator: NavigationContainer;

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

function push(routeName, params?) {
  _navigator.dispatch(
    NavigationActions.push({
      routeName,
      params,
    }),
  );
}

function back() {
  _navigator.dispatch(NavigationActions.back());
}

function getParam(key) {
  const routes = _navigator.state.nav.routes;
  const route = routes[routes.length - 1];
  return route.params[key];
}

export const NavigationService = {
  setTopLevelNavigator,
  navigate,
  push,
  getParam,
  back,
};
