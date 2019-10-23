import React, {useState, useRef, useEffect} from 'react';
import {Text, StyleSheet, SafeAreaView, StatusBar, Dimensions, View} from 'react-native';
import {BottomNavigation} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {Button, Paragraph, Menu, Divider, Provider} from 'react-native-paper';
import Header from '../components/Header';
import ChatsList from './ChatsList';
import px from '../utils/normalizePixel';
import {RootState} from '../reducers';
import {connect, DispatchProp} from 'react-redux';
import Avatar from '../components/Avatar';
import GroupsList from './GroupsList';
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';
import TeamsList from './TeamsList';
import {initTeam, logoutFromCurrentTeam} from '../actions/teams/thunks';
import MembersList from './MembersList';
import UserProfile from './UserProfile';
import Touchable from '../components/Touchable';
import withTheme, {ThemeInjectedProps} from '../contexts/theme/withTheme';
import FastImage from 'react-native-fast-image';
import BottomTabbar from './BottomTabBar';
import showMenu from '../utils/showMenu';
import FilesList from './FilesList';
import {meSelector} from './ChatUI/Message';
import {createSelector} from 'reselect';

type Props = ReturnType<typeof mapStateToProps> & DispatchProp<any> & ThemeInjectedProps;

const Main = React.memo(({currentTeam, currentUser, connectionStatus, dispatch, theme}: Props) => {
  let [bottomTabState, setBottomTabState] = useState({
    index: 0,
    routes: [
      {key: 'chats', title: 'Chats', icon: 'chat', color: '#333333'},
      {key: 'peoples', title: 'Members', icon: 'domain'},
      {key: 'files', title: 'Files', icon: 'file'},
      {key: 'settings', title: 'Settings', icon: 'settings-box'},
    ],
  });
  let [scrollableTabState, setScrollableTabState] = useState({
    index: 0,
    routes: [
      {key: 'directs', title: 'Directs', icon: 'email-open', color: '#333333'},
      {
        key: 'channels',
        title: 'Channels',
        icon: 'account-multiple',
        color: '#333333',
      },
    ],
  });

  let [drawerOpen, setDrawerOpen] = useState(false);
  let menuRef = useRef(null);

  let drawerRef = useRef(null);

  useEffect(() => {
    dispatch(initTeam());
    StatusBar.setBarStyle('light-content');
  }, []);

  let _handleBottomTabIndexChange = index => setBottomTabState({...bottomTabState, index});
  let _handleScrollableTabIndexChange = index =>
    setScrollableTabState({...scrollableTabState, index});

  let _renderScrollableTab = () => (
    <View style={{flex: 1}}>
      <TabView
        navigationState={scrollableTabState}
        renderScene={_renderScrollableTabScene}
        onIndexChange={_handleScrollableTabIndexChange}
        initialLayout={{width: Dimensions.get('window').width}}
        renderTabBar={props => (
          <TabBar
            {...props}
            indicatorStyle={{backgroundColor: '#fff'}}
            style={{
              backgroundColor: '#482046',
              height: px(42.5),
              paddingHorizontal: px(10),
            }}
            labelStyle={{color: '#fff', fontSize: px(13.6)}}
            renderIcon={_renderTabIcon}
            tabStyle={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
            getLabelText={({route}) => route.title}
          />
        )}
      />
    </View>
  );

  let _renderScrollableTabScene = SceneMap({
    directs: ChatsList,
    channels: GroupsList,
  } as any);

  let _renderBottomTabScene = () => {
    switch (bottomTabState.index) {
      case 0:
        return _renderScrollableTab();
      case 1:
        return <MembersList />;
      case 2:
        return <FilesList />;
      case 3:
        return <UserProfile userId={currentUser && currentUser.id} isMe />;
    }
  };

  let _renderTeamLogo = () => (
    <Touchable
      style={styles.teamLogo}
      onPress={() =>
        drawerOpen ? drawerRef.current.closeDrawer() : drawerRef.current.openDrawer()
      }>
      <FastImage
        source={{
          uri: currentTeam && currentTeam.icon && currentTeam.icon.image_44,
        }}
        style={{width: '100%', height: '100%', borderRadius: px(3)}}
      />
    </Touchable>
  );

  let _renderTabIcon = ({route, focused, color}) => (
    <MaterialCommunityIcons name={route.icon} color={focused ? '#fff' : '#ccc'} size={px(19)} />
  );

  let _renderAvatar = () => <Avatar user={currentUser} styles={{height: px(35), width: px(35)}} />;

  let _renderTeamName = () =>
    currentTeam
      ? connectionStatus === 'connected'
        ? currentTeam && currentTeam.name
        : 'Connecting...'
      : 'No team selected';

  let _openMenu = () => {
    showMenu(
      [
        {
          title: 'Settings',
          onPress: () => {},
        },
        {
          title: 'Logout',
          onPress: () => dispatch(logoutFromCurrentTeam()),
        },
      ],
      menuRef.current,
    );
  };

  let _renderMenu = () =>
    currentTeam && (
      <Touchable onPress={_openMenu} ref={ref => (menuRef.current = ref)}>
        <MaterialCommunityIcons name="dots-vertical" color="#fff" size={px(22)} />
      </Touchable>
    );

  let _renderNoTeamSelected = () => (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{color: '#fff'}}>Please signin into a team from side to get started.</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <DrawerLayout
        ref={ref => (drawerRef.current = ref)}
        drawerType="slide"
        renderNavigationView={() => (
          <TeamsList
            toggleDrawer={() => {
              if (drawerOpen) drawerRef.current.closeDrawer();
              else drawerRef.current.openDrawer();
            }}
          />
        )}
        drawerWidth={px(160)}>
        <Header center={_renderTeamName()} left={_renderTeamLogo()} right={_renderMenu()} />
        {currentTeam ? (
          <BottomTabbar
            navigationState={bottomTabState}
            onIndexChange={_handleBottomTabIndexChange}
            renderScene={_renderBottomTabScene}
            renderIcon={_renderTabIcon}
          />
        ) : (
          _renderNoTeamSelected()
        )}
      </DrawerLayout>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3A1C39',
  },
  teamLogo: {
    height: px(32),
    width: px(32),
    backgroundColor: '#eee',
    borderRadius: px(3),
  },
});

export const currentTeamSelector = createSelector(
  [(state: RootState) => state.teams, (state: RootState) => state.entities],
  (teams, entites) => entites.teams.byId[teams.list.find(tm => tm.id === teams.currentTeam)?.id],
);

const mapStateToProps = (state: RootState) => ({
  currentTeam: currentTeamSelector(state),
  currentUser: meSelector(state),
  connectionStatus: state.app.connectionStatus,
});

export default connect(mapStateToProps)(withTheme(Main));
