import React, {Component, PureComponent} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import px from '../../utils/normalizePixel';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {withNavigation, NavigationInjectedProps} from 'react-navigation';
import withTheme, {ThemeInjectedProps} from '../../contexts/theme/withTheme';
import Touchable from '../../components/Touchable';
import {connect, DispatchProp} from 'react-redux';
import {goToAddTeam} from '../../slices/team-thunks';

type Props = NavigationInjectedProps & ThemeInjectedProps & DispatchProp<any>;

class AddTeam extends Component<Props> {
  renderName() {
    let {theme} = this.props;
    return (
      <View style={{flex: 1, justifyContent: 'center'}}>
        <Text style={[styles.name, {color: theme.gray}]}>Add Team</Text>
      </View>
    );
  }

  renderLogo() {
    let {theme} = this.props;
    return (
      <View style={[styles.teamLogo, {borderColor: theme.gray}]}>
        <MaterialCommunityIcons name="plus" size={px(27)} color="#4B4F51" />
      </View>
    );
  }

  handleAddTeam = () => {
    this.props.dispatch(goToAddTeam());
  };

  render() {
    return (
      <Touchable style={styles.container} onPress={this.handleAddTeam}>
        {this.renderLogo()}
        {this.renderName()}
      </Touchable>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: px(55),
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: px(7),
  },
  selectMark: {
    width: px(5),
    height: '90%',
    borderTopRightRadius: px(10),
    borderBottomRightRadius: px(10),
    backgroundColor: '#fff',
  },
  teamLogo: {
    width: px(52),
    height: px(52),
    borderRadius: px(11),
    marginLeft: px(8),
    borderWidth: px(1),
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
  },
  name: {
    marginLeft: px(8),
  },
});

export default withNavigation(withTheme(connect()(AddTeam)));
