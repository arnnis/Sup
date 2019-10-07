import React, {useState, useRef, useEffect} from 'react';
import {Text, StyleSheet, Image, SafeAreaView, StatusBar, Dimensions} from 'react-native';
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
import {initTeam} from '../actions/teams/thunks';
import MembersList from './MembersList';
import UserProfile from './UserProfile';
import Touchable from '../components/Touchable';
import withTheme, {ThemeInjectedProps} from '../contexts/theme/withTheme';

type Props = ReturnType<typeof mapStateToProps> & DispatchProp<any> & ThemeInjectedProps;

const Main = React.memo(({teams, entities, connectionStatus, dispatch, theme}: Props) => {
  let [navigationState, setNavigationState] = useState({
    index: 0,
    routes: [
      {key: 'chats', title: 'Chats', icon: 'email-open', color: '#333333'},
      {
        key: 'groups',
        title: 'Groups',
        icon: 'account-multiple',
        color: '#333333',
      },
      {key: 'peoples', title: 'Members', icon: 'domain'},
      // {key: 'settings', title: 'Settings', icon: 'settings-box'},
    ],
  });

  let [drawerOpen, setDrawerOpen] = useState(false);
  let [menuOpen, setMenuOpen] = useState(false);

  let drawerRef = useRef(null);

  useEffect(() => {
    dispatch(initTeam());
    StatusBar.setBarStyle('light-content');
  }, []);

  let _handleIndexChange = index => setNavigationState({...navigationState, index});

  let currentTeamId = teams.currentTeam;
  let currentTeamInfo = teams.list.find(ws => ws.id === currentTeamId);
  let currentUserId = currentTeamInfo && currentTeamInfo.userId;

  let _renderScene = SceneMap({
    chats: ChatsList,
    groups: GroupsList,
    peoples: MembersList,
    // settings: () => <UserProfile userId={currentUserId} isMe />,
  } as any);

  let currentTeam = entities.teams.byId[currentTeamId];
  let currentUser = entities.users.byId[currentUserId];

  let _renderTeamLogo = () => (
    <Touchable
      style={styles.teamLogo}
      onPress={() =>
        drawerOpen ? drawerRef.current.closeDrawer() : drawerRef.current.openDrawer()
      }>
      <Image
        source={{
          uri: currentTeam && currentTeam.icon && currentTeam.icon.image_44,
        }}
        style={{width: '100%', height: '100%', borderRadius: px(3)}}
      />
    </Touchable>
  );

  let _renderTabIcon = ({route, focused, color}) => (
    <MaterialCommunityIcons name={route.icon} color="#fff" size={px(17)} />
  );

  let _renderAvatar = () => <Avatar user={currentUser} styles={{height: px(35), width: px(35)}} />;

  let _renderTeamName = () =>
    connectionStatus === 'connected' ? currentTeam && currentTeam.name : 'Connecting...';

  let _openMenu = () => setMenuOpen(true);

  let _closeMenu = () => setMenuOpen(false);

  let _renderMenu = () => (
    <Menu
      visible={menuOpen}
      onDismiss={_closeMenu}
      anchor={
        <Touchable onPress={_openMenu}>
          <MaterialCommunityIcons name="dots-vertical" color="#fff" size={px(22)} />
        </Touchable>
      }>
      <Menu.Item onPress={() => {}} title="Settings" />
    </Menu>
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
        <Header
          center={_renderTeamName()}
          left={currentTeam && _renderTeamLogo()}
          right={_renderMenu()}
        />
        <TabView
          navigationState={navigationState}
          renderScene={_renderScene}
          onIndexChange={_handleIndexChange}
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
        {/* <BottomNavigation
            navigationState={navigationState}
            onIndexChange={_handleIndexChange}
            renderScene={_renderScene}
            barStyle={{backgroundColor: '#3D2037', height: px(52.5)}}
            shifting={false}
            renderIcon={_renderTabIcon}
            style={{backgroundColor: theme.backgroundColor}}
          /> */}
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

const mapStateToProps = (state: RootState) => ({
  teams: state.teams,
  entities: state.entities,
  connectionStatus: state.app.connectionStatus,
});

export default connect(mapStateToProps)(withTheme(Main));
