import React, {useEffect} from 'react';
import {YellowBox} from 'react-native';
import {Provider as ReduxProvider} from 'react-redux';
import {Provider as PaperProvider} from 'react-native-paper';
import {Portal} from 'react-native-paper';

import Navigator, {NavigationService} from './navigation/Navigator';
import configureStore from './store/configureStore';
import {PersistGate} from 'redux-persist/integration/react';
import ThemeProvider from './contexts/theme/provider';

export const {store, persistor} = configureStore();

const App = () => {
  useEffect(() => {
    console.disableYellowBox = true;
    YellowBox.ignoreWarnings(['deprecated', 'Require cycle']);
  }, []);

  return (
    <ReduxProvider store={store}>
      <ThemeProvider>
        <PaperProvider>
          <PersistGate loading={null} persistor={persistor}>
            <Portal.Host>
              <Navigator
                ref={navigatorRef => {
                  NavigationService.setTopLevelNavigator(navigatorRef);
                }}
              />
            </Portal.Host>
          </PersistGate>
        </PaperProvider>
      </ThemeProvider>
    </ReduxProvider>
  );
};

export default App;
