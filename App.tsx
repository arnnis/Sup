import React, {useEffect} from 'react';
import {StatusBar, YellowBox, Linking, AsyncStorage} from 'react-native';
import {Provider as ReduxProvider} from 'react-redux';
import Navigator, {NavigationService} from './src/navigation/Navigator';
import configureStore from './src/store/configureStore';
import {PersistGate} from 'redux-persist/integration/react';
import ThemeProvider from './src/contexts/theme/provider';

export const {store, persistor} = configureStore();

const App = () => {
  useEffect(() => {
    // persistor.purge();
    // AsyncStorage.clear();
    console.disableYellowBox = true;
    YellowBox.ignoreWarnings(['deprecated', 'Require cycle']);
  }, []);

  return (
    <ReduxProvider store={store}>
      <ThemeProvider>
        <PersistGate loading={null} persistor={persistor}>
          <Navigator
            ref={navigatorRef => {
              NavigationService.setTopLevelNavigator(navigatorRef);
            }}
          />
        </PersistGate>
      </ThemeProvider>
    </ReduxProvider>
  );
};

export default App;
