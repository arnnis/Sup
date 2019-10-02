import React, {FC} from 'react';
import {Text} from 'react-native';
import {RootState} from '../../reducers';
import {connect} from 'react-redux';
import withTheme, {ThemeInjectedProps} from '../../contexts/theme/withTheme';
import {NavigationInjectedProps, withNavigation} from 'react-navigation';

type Props = ReturnType<typeof mapStateToProps> &
  ThemeInjectedProps &
  NavigationInjectedProps & {
    username: string;
  };

const Username: FC<Props> = ({username, entities, navigation}) => {
  username = username
    .replace('@', '')
    .replace('<', '')
    .replace('>', '');

  let handlePress = () => {
    navigation.navigate('UserProfile', {userId: username});
  };

  return (
    <Text onPress={handlePress}>
      @{entities.users.byId[username] && entities.users.byId[username].name}
    </Text>
  );
};

const mapStateToProps = (state: RootState) => ({
  entities: state.entities,
});

export default connect(mapStateToProps)(withTheme(withNavigation(Username)));
