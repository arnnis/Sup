import React, {Component} from 'react';
import {View, Text, StyleSheet, ScrollView, SafeAreaView} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../components/Header';
import {RootState} from '../reducers';
import {connect, DispatchProp} from 'react-redux';
import {NavigationInjectedProps, withNavigation, NavigationActions} from 'react-navigation';
import px from '../utils/normalizePixel';
import {User} from '../models';
import {openChat} from '../actions/chats/thunks';
import {ActivityIndicator} from 'react-native-paper';
import withTheme, {ThemeInjectedProps} from '../contexts/theme/withTheme';
import Touchable from '../components/Touchable';
import FastImage from 'react-native-fast-image';
import {currentTeamTokenSelector} from '../reducers/teams';

type Props = ReturnType<typeof mapStateToProps> &
  ThemeInjectedProps &
  NavigationInjectedProps &
  DispatchProp<any> & {
    userId: string;
    isMe: boolean;
  };

class UserProfile extends Component<Props> {
  state = {
    isOpeningChat: false,
  };

  componentDidMount() {
    let {entities, navigation} = this.props;
    let userId = navigation.getParam('userId');
    let user = entities.users.byId[userId];

    // TODO: get user info
  }

  handleMessagePress = async () => {
    let {navigation, dispatch} = this.props;
    let userId = navigation.getParam('userId') || this.props.userId;

    this.setState({isOpeningChat: true});
    try {
      let chatId = await dispatch(openChat([userId]));
      navigation.push('ChatUI', {chatId}, NavigationActions.NAVIGATE);
    } catch (err) {
      console.log(err);
    } finally {
      this.setState({isOpeningChat: false});
    }
  };

  handleCallPress = () => {
    alert('This feature is not supported');
  };

  renderHeader(user: User) {
    let {theme, token} = this.props;
    return (
      <View style={styles.headerContainer}>
        <View>
          <FastImage
            source={{uri: user.profile.image_192, headers: {Authorization: 'Bearer ' + token}}}
            style={styles.avatar}
          />
          {user.presence === 'active' && <View style={styles.onlineBadge} />}
        </View>

        <Text style={[styles.name, {color: theme.foregroundColor}]}>
          {user.profile.display_name_normalized || user.profile.real_name_normalized}
        </Text>
        <Text style={[styles.jobTitle, {color: theme.backgroundColorLess5}]}>
          {user.profile.title}
        </Text>
      </View>
    );
  }

  renderButtons(user: User) {
    let {isMe, theme} = this.props;
    let {isOpeningChat} = this.state;
    return (
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: px(17.5),
          marginBottom: px(35),
        }}>
        {isMe && (
          <Touchable style={[styles.button, {backgroundColor: theme.backgroundColorLess2}]}>
            <Text style={[styles.buttonTitle, {color: theme.foregroundColor}]}>Edit Profile</Text>
          </Touchable>
        )}
        {!isMe && (
          <Touchable
            style={[styles.button, {backgroundColor: theme.backgroundColorLess2}]}
            onPress={this.handleCallPress}>
            <Text style={[styles.buttonTitle, {color: theme.foregroundColor}]}>Call</Text>
          </Touchable>
        )}
        <Touchable
          style={[styles.button, {backgroundColor: theme.backgroundColorLess2}]}
          onPress={this.handleMessagePress}
          disabled={isOpeningChat}>
          {isOpeningChat ? (
            <ActivityIndicator size="small" color="#3D2037" />
          ) : (
            <Text style={[styles.buttonTitle, {color: theme.foregroundColor}]}>Message</Text>
          )}
        </Touchable>
      </View>
    );
  }

  renderInfoRow(title: string, text: string, icon?: string, onPress?: any) {
    let {theme} = this.props;
    return (
      <Touchable disabled={!onPress} style={styles.infoRow} onPress={onPress}>
        <View style={{flexDirection: 'row'}}>
          {icon ? (
            <MaterialCommunityIcons
              name={icon}
              size={px(22)}
              color="#707070"
              style={{marginRight: px(8), marginTop: -px(1)}}
            />
          ) : null}
          <Text style={[styles.infoRowTitle, {color: theme.foregroundColor}]}>{title}</Text>
        </View>
        {text ? (
          <Text style={[styles.infoRowText, {color: theme.backgroundColorLess4}]}>{text}</Text>
        ) : null}
        <View style={[styles.divider, {backgroundColor: theme.backgroundColorLess4}]} />
      </Touchable>
    );
  }

  renderMeOptions() {
    return (
      <>
        {this.renderInfoRow('Set a status', '', 'face')}
        {this.renderInfoRow('Prefrences', '', 'settings-outline')}
      </>
    );
  }

  renderUserInfoRows(user: User) {
    return (
      <>
        {this.renderInfoRow('Timezone', user.tz_label)}
        {user.profile.email && this.renderInfoRow('Email', user.profile.email)}
      </>
    );
  }

  render() {
    let {entities, navigation, isMe, theme} = this.props;
    let userId = navigation.getParam('userId') || this.props.userId;
    let user = entities.users.byId[userId];

    if (!user) return null;

    return (
      <>
        <Background />
        <SafeAreaView style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
          {!isMe && (
            <Header
              center={`${user.profile.real_name_normalized ||
                user.profile.display_name_normalized}'s Profile`}
              left="back"
            />
          )}
          <ScrollView>
            {this.renderHeader(user)}
            {this.renderButtons(user)}
            {isMe && this.renderMeOptions()}
            {!isMe && this.renderUserInfoRows(user)}
            {/* {this.renderInfoRow()} */}
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
}

const Background = () => (
  <View style={styles.backgroundContainer}>
    <View
      style={{
        height: px(120),
        width: '100%',
        backgroundColor: '#F5F5F5',
      }}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3A1C39',
  },
  backgroundContainer: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    paddingTop: px(75),
  },
  headerContainer: {
    width: '100%',
    alignItems: 'center',
  },
  avatar: {
    width: px(140),
    height: px(140),
    borderRadius: px(70),
    backgroundColor: '#ccc',
    marginTop: px(50),
  },
  name: {
    fontSize: px(16.5),
    fontWeight: '500',
    marginTop: px(17.5),
  },
  jobTitle: {
    fontSize: px(13),
    color: '#8B8B8B',
    marginTop: px(7.5),
    marginHorizontal: px(15),
    textAlign: 'center',
  },
  button: {
    width: px(110),
    height: px(40),
    backgroundColor: '#ECECEC',
    marginHorizontal: px(10),
    borderRadius: px(3),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTitle: {
    color: '#0E2A47',
  },
  infoRow: {
    width: '100%',
    marginBottom: px(20),
    paddingHorizontal: px(17.5),
    justifyContent: 'center',
  },
  infoRowTitle: {
    fontSize: px(15),
    color: '#0E2A47',
    fontWeight: '500',
    marginBottom: px(15),
  },
  infoRowText: {
    fontSize: px(13.5),
    color: '#8B8B8B',
    marginLeft: px(2),
    marginBottom: px(10),
    marginTop: -px(10),
  },
  divider: {
    position: 'absolute',
    width: '95%',
    height: 1,
    backgroundColor: '#C5C5C5',
    bottom: 0,
    left: '5%',
  },
  onlineBadge: {
    position: 'absolute',
    left: px(15),
    bottom: px(10),
    width: px(12),
    height: px(12),
    borderRadius: px(6),
    backgroundColor: 'green',
  },
});

const mapStateToProps = (state: RootState) => ({
  entities: state.entities,
  token: currentTeamTokenSelector(state),
});

export default connect(mapStateToProps)(withNavigation(withTheme(UserProfile)));
