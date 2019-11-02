import React, {PureComponent} from 'react';
import {connect, DispatchProp} from 'react-redux';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import px from '../../utils/normalizePixel';
import {User} from '../../models';
import Avatar from '../../components/Avatar';
import {RootState} from '../../reducers';
import withTheme, {ThemeInjectedProps} from '../../contexts/theme/withTheme';
import Touchable from '../../components/Touchable';
import {NavigationInjectedProps, withNavigation} from 'react-navigation';

const {width} = Dimensions.get('window');

type Props = ReturnType<typeof mapStateToProps> &
  NavigationInjectedProps &
  ThemeInjectedProps &
  DispatchProp<any> & {
    memberId: string;
  };

class MemberCell extends PureComponent<Props> {
  handlePress = () =>
    this.props.navigation.navigate('UserProfile', {
      userId: this.props.memberId,
    });

  renderAvatar(user: User) {
    return (
      <Avatar userId={user.id} width={px(67.5)} style={{borderRadius: px(15)}} containerStyle />
    );
  }

  renderName(member: User) {
    let {theme} = this.props;
    if (!member) return null;

    return (
      <Text style={[styles.name, {color: theme.foregroundColor}]} numberOfLines={1}>
        {member.profile.display_name_normalized || member.profile.real_name_normalized}
      </Text>
    );
  }

  renderJobTitle(member: User) {
    let {theme} = this.props;
    if (!member) return null;
    return (
      <View>
        <Text style={[styles.jobTitle, {color: theme.backgroundColorLess5}]} numberOfLines={2}>
          {member.profile.title}
        </Text>
      </View>
    );
  }

  render() {
    let {member, theme} = this.props;

    if (!member) return null;

    return (
      <Touchable
        style={[
          styles.container,
          {
            backgroundColor: 'transparent',
          },
        ]}
        onPress={this.handlePress}>
        {this.renderAvatar(member)}
        <View style={{flex: 1, alignItems: 'center'}}>
          {this.renderName(member)}
          {this.renderJobTitle(member)}
        </View>
      </Touchable>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: width / 3 - 10,
    alignItems: 'center',
    paddingHorizontal: px(7.5),
    paddingTop: px(15),
    height: px(150),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    elevation: 1,
  },
  name: {
    fontWeight: '700',
    fontSize: px(14),
    marginTop: px(12.5),
  },
  jobTitle: {
    color: '#8B8B8B',
    marginTop: px(5),
    fontSize: px(13),
  },
});

const mapStateToProps = (state: RootState, ownProps) => ({
  member: state.entities.users.byId[ownProps.memberId],
});

export default connect(mapStateToProps)(withTheme(withNavigation(MemberCell)));
