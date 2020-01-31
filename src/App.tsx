import React, {useEffect} from 'react';
import {YellowBox} from 'react-native';
import {Provider as ReduxProvider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';

import Navigator, {NavigationService} from './navigation/Navigator';
import configureStore from './store/configureStore';
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
