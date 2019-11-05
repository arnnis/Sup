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

const dims = Dimensions.get('window');

type Props = ReturnType<typeof mapStateToProps> &
  NavigationInjectedProps &
  ThemeInjectedProps &
  DispatchProp<any> & {
    memberId: string;
    isFirst: boolean;
    isLast: boolean;
  };

class ChannelMemberCell extends PureComponent<Props> {
  handlePress = () =>
    this.props.navigation.navigate('UserProfile', {
      userId: this.props.memberId,
    });

  renderAvatar(user: User) {
    return <Avatar userId={user.id} width={px(42)} containerStyle={{marginLeft: px(7.5)}} />;
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
          {member.is_bot && 'bot'}
        </Text>
      </View>
    );
  }

  render() {
    let {member, isFirst, isLast, theme} = this.props;

    if (!member) return null;

    return (
      <Touchable
        style={[
          styles.container,
          {backgroundColor: theme.backgroundColor},
          isFirst && {borderTopRightRadius: px(15), borderTopLeftRadius: px(15)},
          isLast && {borderBottomRightRadius: px(15), borderBottomLeftRadius: px(15)},
        ]}
        onPress={this.handlePress}>
        {this.renderAvatar(member)}
        <View
          style={{
            flex: 1,
            height: '100%',
            justifyContent: 'center',
            marginLeft: px(15),
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: theme.backgroundColorLess2,
          }}>
          {this.renderName(member)}
          {this.renderJobTitle(member)}
        </View>
      </Touchable>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: dims.width - px(40),
    alignItems: 'center',
    paddingHorizontal: px(7.5),
    height: px(55),
    flexDirection: 'row',
    marginHorizontal: px(20),
  },
  name: {
    fontWeight: '700',
    fontSize: px(14),
  },
  jobTitle: {
    color: '#8B8B8B',
    marginTop: px(2.5),
    fontSize: px(13),
  },
});

const mapStateToProps = (state: RootState, ownProps) => ({
  member: state.entities.users.byId[ownProps.memberId],
});

export default connect(mapStateToProps)(withTheme(withNavigation(ChannelMemberCell)));
