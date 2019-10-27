import React, {useState, useRef, useEffect} from 'react';
import {StyleSheet, SafeAreaView, StatusBar, View} from 'react-native';
import MediaQuery from "../../utils/stylesheet/MediaQuery";
import Header from '../../components/Header';
import px from '../../utils/normalizePixel';
import {RootState} from '../../reducers';
import {connect, DispatchProp} from 'react-redux';
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';
import TeamsList from '../TeamsList';
import {initTeam} from '../../actions/teams/thunks';
import withTheme, {ThemeInjectedProps} from '../../contexts/theme/withTheme';
import BottomTabbar from './BottomTabBar';
import {createSelector} from 'reselect';
import TeamEmptyPlaceholder from './TeamEmptyPlaceholder';
import ChangeTeamButton from './ChangeTeamButton';
import PopupMenu from './PopupMenu';
import styled from '../../utils/stylesheet/styled';
import ChatUI from '../ChatUI';
import ChatEmptyPlaceholder from './ChatEmptyPlaceholder';
import BottomSheet from './BottomSheet';

type Props = ReturnType<typeof mapStateToProps> & DispatchProp<any> & ThemeInjectedProps;

const Main = React.memo(({currentTeam, connectionStatus, dispatch, currentChatId, currentThreadId}: Props) => {
  let [drawerOpen, setDrawerOpen] = useState(false);
  let drawerRef = useRef(null);
  
  useEffect(() => {
    dispatch(initTeam());
    StatusBar.setBarStyle('light-content');
  }, []);

  let _renderChangeTeamButton = () => (
    <ChangeTeamButton
      onPress={() => {
        if (drawerOpen) {
          drawerRef.current.closeDrawer()
        } else {
          drawerRef.current.openDrawer()
        }
        setDrawerOpen(!drawerOpen)
      }
        
      } />
  );

  let _renderConnectionStatus = () =>
    currentTeam
      ? connectionStatus === 'connected'
        ? currentTeam && currentTeam.name
        : 'Connecting...'
      : 'No team selected';

  let _renderMenu = () =>
    currentTeam && (
      <PopupMenu />
    );

  return (
    <SafeAreaView style={styles.container}>
      <DrawerLayout
        ref={ref => (drawerRef.current = ref)}
        drawerType="slide"
        renderNavigationView={() => (
          <TeamsList
            onTeamSelect={() => {
              if (drawerOpen) drawerRef.current.closeDrawer();
              else drawerRef.current.openDrawer();
            }}
          />
        )}
        drawerWidth={px(160)}>
          <View style={{flex: 1,  flexDirection: 'row'}}>
            <MasterView>
              <Header center={_renderConnectionStatus()} left={_renderChangeTeamButton()} right={_renderMenu()} />
              {currentTeam ? (
                <BottomTabbar />
              ) : (
                <TeamEmptyPlaceholder />
              )}
            </MasterView>
            <MediaQuery orientation="landscape">
              <View style={{flex: 1, backgroundColor: 'red'}}>
                {currentChatId? <ChatUI chatId={currentChatId} threadId={currentThreadId} /> : <ChatEmptyPlaceholder />}
              </View>
            </MediaQuery>
          </View>
      </DrawerLayout>
      <BottomSheet />
    </SafeAreaView>
  );
});

const MasterView = styled(View)(({theme}) => ({
  width: '100%',
  height: '100%',
  media: [{ orientation: 'landscape' }, {
    width: px(325)
  }]
}))

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3A1C39',
  }
});

export const currentTeamSelector = createSelector(
  [(state: RootState) => state.teams, (state: RootState) => state.entities],
  (teams, entites) => entites.teams.byId[teams.list.find(tm => tm.id === teams.currentTeam)?.id],
);

const mapStateToProps = (state: RootState) => ({
  currentTeam: currentTeamSelector(state),
  connectionStatus: state.app.connectionStatus,
  currentChatId: state.chats.currentChatId,
  currentThreadId: state.chats.currentThreadId
});

export default connect(mapStateToProps)(withTheme(Main));
