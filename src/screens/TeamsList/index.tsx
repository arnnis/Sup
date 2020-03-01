import React, {Component, PureComponent} from 'react';
import {DispatchProp} from 'react-redux';
import {View, StyleSheet, FlatList, ActivityIndicator, Text} from 'react-native';
import {connect} from 'react-redux';
import {RootState} from '../../reducers';
import {NavigationInjectedProps, withNavigation} from 'react-navigation';

import px from '../../utils/normalizePixel';
import TeamCell from './TeamCell';
import AddTeam from './AddTeam';
import {Team} from '../../models';
import {switchTeam} from '../../actions/teams/thunks';
import withTheme, {ThemeInjectedProps} from '../../contexts/theme/withTheme';
import {Version} from '../../env';

type Props = ReturnType<typeof mapStateToProps> &
  ThemeInjectedProps &
  DispatchProp<any> &
  NavigationInjectedProps & {
    onTeamSelect(): void;
  };

class TeamsList extends Component<Props> {
  handleTeamPress = (team: Team) => {
    this.props.dispatch(switchTeam(team.id));
    this.props.onTeamSelect();
  };

  renderTeamCell = ({item: teamInfo, index}) => {
    let {entities, currentTeam} = this.props;
    let team = entities.teams.byId[teamInfo.id];

    if (!team) return null;
    return (
      <TeamCell
        key={teamInfo.id}
        team={team}
        onPress={this.handleTeamPress}
        selected={team.id === currentTeam}
      />
    );
  };

  renderLoading() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  renderVersion() {
    return (
      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>v{Version}</Text>
      </View>
    );
  }

  render() {
    let {teamsList, theme} = this.props;

    return (
      <View style={[styles.container, {backgroundColor: theme.darkGray}]}>
        <FlatList
          data={teamsList}
          //extraData={entities.teams}
          renderItem={this.renderTeamCell}
          getItemLayout={(data, index) => ({
            length: px(50),
            offset: px(50) * index,
            index,
          })}
          ListFooterComponent={<AddTeam />}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1D2124',

    paddingTop: px(35),
  },

  versionContainer: {
    position: 'absolute',
    left: 0,
    bottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  versionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

const mapStateToProps = (state: RootState) => ({
  teamsList: state.teams.list,
  entities: state.entities,
  loading: state.chats.loading,
  currentTeam: state.teams.currentTeam,
});

export default connect(mapStateToProps)(withNavigation(withTheme(TeamsList)));
