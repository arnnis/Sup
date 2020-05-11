import NetInfo from '@react-native-community/netinfo';
import {API_URL} from '../../env';
import {NetworkError, SlackError, ServerError} from './errors';
import {store} from '../../store/configureStore';
import {RootState} from '../../reducers';
import {Platform} from 'react-native';
import {logoutFromCurrentTeam} from '../../slices/team-thunks';
import {currentTeamTokenSelector} from '../../slices/teams-slice';

interface RequestOption {
  path: string;
  method?: 'GET' | 'POST';
  isFormData?: boolean;
  silent?: boolean;
  body?: any;
}

export default async (options: RequestOption) => {
  let {path, method, silent, body, isFormData} = options;
  try {
    if (silent === undefined) silent = false;
    silent = Platform.OS === 'web' ? true : silent;

    let isConnected = await NetInfo.isConnected.fetch();
    if (!isConnected) {
      !silent && alert('Network not available');
      throw new NetworkError();
    }

    if (isFormData === undefined) isFormData = true;

    if (!method) method = 'GET';

    if (body) method = 'POST';
    if (!body) body = {};

    let state: RootState = store.getState();
    let token = currentTeamTokenSelector(state) || '';

    body['token'] = token;

    let response = await fetch(`${API_URL}${path}`, {
      method,
      headers: {},
      body: isFormData ? createFormData(body) : JSON.stringify(body),
    });

    if (response.ok) {
      let responseJson = await response.json();

      if (responseJson.ok) {
        return Promise.resolve(responseJson);
      } else {
        console.log(`Slack error in ${path}:`, responseJson.error);
        throw new SlackError(responseJson.error);
      }
    } else {
      console.log(response);
      throw new ServerError(response.status);
    }
  } catch (err) {
    if (err instanceof SlackError) {
      handleSlackError(err, path, silent);
    } else if (err instanceof NetworkError) {
      !silent && alert('Please check your internet connection');
    } else if (err instanceof ServerError) {
      !silent && alert('There is a problem on Slack side');
    } else {
      !silent && alert('Unknown error');
    }
    console.log(err);
    return Promise.reject(err);
  }
};

const handleSlackError = (error: SlackError, path: string, silent: boolean) => {
  !silent && console.log('SlackError: ' + error.message + '\npath: ' + path);
  if (
    error.message === 'invalid_auth' ||
    error.message === 'token_revoked' ||
    error.message === 'account_inactive'
  ) {
    store.dispatch(logoutFromCurrentTeam() as any);
    return;
  }
};

const createFormData = (body: any) => {
  let formData = new FormData();
  for (let field in body) {
    formData.append(field, body[field]);
  }
  return formData;
};
