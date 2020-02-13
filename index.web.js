import {AppRegistry} from 'react-native';

import App from './src/App';
import './web/index.css';

const appName = 'Sup';

AppRegistry.registerComponent(appName, () => App);

AppRegistry.runApplication(appName, {
  rootTag: document.getElementById('root'),
});

// Load fonts
require('./web/load-fonts').default();

// Enable webpack hot reloading
if (module.hot) {
  module.hot.accept();
}

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}
