import React, {useState, useRef, useEffect, FC} from 'react';
import {StatusBar, View} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {useMediaQuery} from 'react-responsive';
import {Portal} from 'react-native-paper';

import Header from '../../components/Header';
import px from '../../utils/normalizePixel';
import {RootState} from '../../reducers';
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';
import TeamsList from '../TeamsList';
import {initTeam} from '../../actions/teams/thunks';
import BottomTabbar from './BottomTabBar';
import TeamEmptyPlaceholder from './TeamEmptyPlaceholder';
import ChangeTeamButton from './ChangeTeamButton';
import PopupMenu from './PopupMenu';
import ChatUI from '../ChatUI';
import ChatEmptyPlaceholder from './ChatEmptyPlaceholder';
import BottomSheet from './BottomSheet';
import {currentTeamSelector} from '../../reducers/teams';
import Toast from '../../components/Toast';
import {toggleToast, setDrawerOpen} from '../../actions/app';
import Screen from '../../components/Screen';
import Menu from '../../components/Menu/Menu';

const Main: FC = React.memo(() => {
  let drawerOpen = useSelector((state: RootState) => state.app.drawerOpen);
  let drawerRef = useRef(null);
  let {currentTeam, connectionStatus, currentChatId} = useSelector((state: RootState) => ({
    currentTeam: currentTeamSelector(state),
    connectionStatus: state.app.connectionStatus,
    currentChatId: state.chats.currentChatId,
  }));
  let dispatch = useDispatch();
  let isLandscape = useMediaQuery({orientation: 'landscape'});

  useEffect(() => {
    dispatch(initTeam());
    StatusBar.setBarStyle('light-content');
    global['toast'] = toast => dispatch(toggleToast(toast));
  }, []);

  useEffect(() => {
    if (!drawerOpen) {
      drawerRef.current.closeDrawer();
    } else {
      drawerRef.current.openDrawer();
    }
  }, [drawerOpen]);

  const toggleDrawer = () => {
    if (drawerOpen) {
      drawerRef.current.closeDrawer();
      dispatch(setDrawerOpen(false));
    } else {
      drawerRef.current.openDrawer();
      dispatch(setDrawerOpen(true));
    }
  };

  const renderChangeTeamButton = () => <ChangeTeamButton onPress={toggleDrawer} />;

  const renderConnectionStatus = () =>
    currentTeam
      ? connectionStatus === 'connected'
        ? currentTeam && currentTeam.name
        : 'Connecting...'
      : 'Sup';

  const renderMenu = () => currentTeam && <PopupMenu />;

  const renderCurrentChat = () => {
    if (isLandscape)
      return currentChatId ? <ChatUI chatId={currentChatId} /> : <ChatEmptyPlaceholder />;

    return null;
  };

  const renderMain = () => {
    return (
      <View style={{width: isLandscape ? px(325) : '100%'}}>
        <Header
          center={renderConnectionStatus()}
          left={renderChangeTeamButton()}
          right={renderMenu()}
          style={{elevation: 0}}
        />
        {currentTeam ? <BottomTabbar /> : <TeamEmptyPlaceholder />}
      </View>
    );
  };

  return (
    <Portal.Host>
      <Screen>
        <StatusBar backgroundColor="#3A1C39" animated />
        <DrawerLayout
          ref={ref => (drawerRef.current = ref)}
          drawerType="slide"
          renderNavigationView={() => <TeamsList onTeamSelect={toggleDrawer} />}
          drawerWidth={px(185)}
          onDrawerClose={() => dispatch(setDrawerOpen(false))}
          onDrawerOpen={() => dispatch(setDrawerOpen(true))}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            {renderMain()}
            {renderCurrentChat()}
          </View>
        </DrawerLayout>
        <BottomSheet />
        <Toast />
      </Screen>
    </Portal.Host>
  );
});

export default Main;
