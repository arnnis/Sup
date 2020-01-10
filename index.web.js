import {AppRegistry} from 'react-native';

import App from './src/App';
import './web/index.css';

const appName = 'Sup';

AppRegistry.registerComponent(appName, () => App);

AppRegistry.runApplication(appName, {
  rootTag: document.getElementById('root'),
});

require('./web/load-fonts').default();

if (module.hot) {
  module.hot.accept();
}
