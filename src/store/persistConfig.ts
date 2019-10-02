import {AsyncStorage} from 'react-native';
import {createMigrate} from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

import {createWhitelistFilter} from 'redux-persist-transform-filter';

const entitiesFilter = createWhitelistFilter('entities', ['teams']);

const teamsFilter = createWhitelistFilter('teams', ['list', 'currentTeam']);

const migrations = {};

export default {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
  whitelist: ['teams', 'entities'],
  transforms: [entitiesFilter, teamsFilter],
  migrate: createMigrate(migrations, {debug: false}),
  stateReconciler: autoMergeLevel2,
};
