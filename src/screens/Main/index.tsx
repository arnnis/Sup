import React, {useState, useRef, useEffect, FC} from 'react';
import {StatusBar, View} from 'react-native';
import {Portal} from 'react-native-paper';
import {useSelector, useDispatch} from 'react-redux';

import MediaQuery from '../../utils/stylesheet/MediaQuery';
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
import styled from '../../utils/stylesheet/styled';
import ChatUI from '../ChatUI';
import ChatEmptyPlaceholder from './ChatEmptyPlaceholder';
import BottomSheet from './BottomSheet';
import {currentTeamSelector} from '../../reducers/teams';
import Toast from '../../components/Toast';
import {toggleToast} from '../../actions/app';
import Screen from '../../components/Screen';

const Main: FC = React.memo(() => {
  let [drawerOpen, setDrawerOpen] = useState(false);
  let drawerRef = useRef(null);
  let {currentTeam, connectionStatus, currentChatId} = useSelector((state: RootState) => ({
    currentTeam: currentTeamSelector(state),
    connectionStatus: state.app.connectionStatus,
    currentChatId: state.chats.currentChatId,
  }));
  let dispatch = useDispatch();

  useEffect(() => {
    dispatch(initTeam());
    StatusBar.setBarStyle('light-content');
    global['toast'] = toast => dispatch(toggleToast(toast));
  }, []);

  const _toggleDrawer = () => {
    if (drawerOpen) {
      drawerRef.current.closeDrawer();
      setDrawerOpen(false);
    } else {
      drawerRef.current.openDrawer();
      setDrawerOpen(true);
    }
  };

  const _renderChangeTeamButton = () => <ChangeTeamButton onPress={_toggleDrawer} />;

  const _renderConnectionStatus = () =>
    currentTeam
      ? connectionStatus === 'connected'
        ? currentTeam && currentTeam.name
        : 'Connecting...'
      : 'Sup';

  const _renderMenu = () => currentTeam && <PopupMenu />;

  return (
    <Portal.Host>
      <Screen>
        <StatusBar backgroundColor="#3A1C39" animated />
        <DrawerLayout
          ref={ref => (drawerRef.current = ref)}
          drawerType="slide"
          renderNavigationView={() => <TeamsList onTeamSelect={_toggleDrawer} />}
          drawerWidth={px(185)}
          onDrawerClose={() => setDrawerOpen(false)}
          onDrawerOpen={() => setDrawerOpen(true)}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <MasterView>
              <Header
                center={_renderConnectionStatus()}
                left={_renderChangeTeamButton()}
                right={_renderMenu()}
                style={{elevation: 0}}
              />
              {currentTeam ? <BottomTabbar /> : <TeamEmptyPlaceholder />}
            </MasterView>
            <MediaQuery orientation="landscape">
              <View style={{flex: 1, backgroundColor: 'red'}}>
                {currentChatId ? <ChatUI chatId={currentChatId} /> : <ChatEmptyPlaceholder />}
              </View>
            </MediaQuery>
          </View>
        </DrawerLayout>
        <BottomSheet />
        <Toast />
      </Screen>
    </Portal.Host>
  );
});

const MasterView = styled(View)(({theme}) => ({
  width: '100%',
  height: '100%',
  media: [
    {orientation: 'landscape'},
    {
      width: px(325),
    },
  ],
}));

export default Main;
