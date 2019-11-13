import React, {useState, useRef, useEffect} from 'react';
import {StyleSheet, SafeAreaView, StatusBar, View} from 'react-native';
import MediaQuery from '../../utils/stylesheet/MediaQuery';
import Header from '../../components/Header';
import px from '../../utils/normalizePixel';
import {RootState} from '../../reducers';
import {connect, DispatchProp} from 'react-redux';
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';
import TeamsList from '../TeamsList';
import {initTeam} from '../../actions/teams/thunks';
import withTheme, {ThemeInjectedProps} from '../../contexts/theme/withTheme';
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

type Props = ReturnType<typeof mapStateToProps> & DispatchProp<any> & ThemeInjectedProps;

const Main = React.memo(
  ({currentTeam, connectionStatus, dispatch, currentChatId, currentThreadId}: Props) => {
    let [drawerOpen, setDrawerOpen] = useState(false);
    let drawerRef = useRef(null);

    useEffect(() => {
      dispatch(initTeam());
      StatusBar.setBarStyle('light-content');
      global['toast'] = toast => dispatch(toggleToast(toast));
    }, []);

    let _toggleDrawer = () => {
      if (drawerOpen) {
        drawerRef.current.closeDrawer();
        setDrawerOpen(false);
      } else {
        drawerRef.current.openDrawer();
        setDrawerOpen(true);
      }
    };

    let _renderChangeTeamButton = () => <ChangeTeamButton onPress={_toggleDrawer} />;

    let _renderConnectionStatus = () =>
      currentTeam
        ? connectionStatus === 'connected'
          ? currentTeam && currentTeam.name
          : 'Connecting...'
        : 'Sup';

    let _renderMenu = () => currentTeam && <PopupMenu />;

    return (
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
                {currentChatId ? (
                  <ChatUI chatId={currentChatId} threadId={currentThreadId} />
                ) : (
                  <ChatEmptyPlaceholder />
                )}
              </View>
            </MediaQuery>
          </View>
        </DrawerLayout>
        <BottomSheet />
        <Toast />
      </Screen>
    );
  },
);

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3A1C39',
  },
});

const mapStateToProps = (state: RootState) => ({
  currentTeam: currentTeamSelector(state),
  connectionStatus: state.app.connectionStatus,
  currentChatId: state.chats.currentChatId,
  currentThreadId: state.chats.currentThreadId,
});

export default connect(mapStateToProps)(withTheme(Main));
