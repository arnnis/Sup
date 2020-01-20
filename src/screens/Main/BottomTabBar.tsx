import React, {useState, FC, useContext} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import px from '../../utils/normalizePixel';
import Touchable from '../../components/Touchable';
import ScrollableTabView from './ScrollableTabBar';
import MembersList from '../MembersList';
import FilesList from '../FilesList';
import UserProfile from '../UserProfile';
import {RootState} from '../../reducers';
import {connect} from 'react-redux';
import {meSelector} from '../../reducers/teams';
import ThemeContext from '../../contexts/theme';

type Props = ReturnType<typeof mapStateToProps>;

const BottomTabbar: FC<Props> = ({currentUser}) => {
  let [bottomTabState, setBottomTabState] = useState({
    index: 0,
    routes: [
      {key: 'chats', title: 'Chats', icon: 'chat', color: '#333333'},
      {key: 'peoples', title: 'Members', icon: 'domain'},
      {key: 'files', title: 'Files', icon: 'file'},
      {key: 'settings', title: 'Settings', icon: 'settings-box'},
    ],
  });

  let {theme} = useContext(ThemeContext);

  let onIndexChange = index => setBottomTabState({...bottomTabState, index});

  let _renderBottomTabScene = () => {
    switch (bottomTabState.index) {
      case 0:
        return <ScrollableTabView />;
      case 1:
        return <MembersList />;
      case 2:
        return <FilesList />;
      case 3:
        return <UserProfile userId={currentUser && currentUser.id} isMe />;
    }
  };

  let _renderTabIcon = ({route, focused}) => (
    <MaterialCommunityIcons name={route.icon} color={focused ? '#fff' : '#ccc'} size={px(20)} />
  );

  return (
    <View
      style={{flex: 1, borderRightWidth: px(1.45), borderRightColor: theme.backgroundColorDarker2}}>
      {_renderBottomTabScene()}
      <View style={styles.container}>
        {bottomTabState.routes.map((tab, index) => {
          let active = index === bottomTabState.index;
          return (
            <Tab
              title={tab.title}
              icon={_renderTabIcon({route: tab, focused: active})}
              onPress={() => onIndexChange(index)}
              active={active}
            />
          );
        })}
      </View>
    </View>
  );
};

const Tab = ({title, icon, onPress, active}) => (
  <Touchable style={styles.tab} onPress={onPress}>
    {icon}
    <Text style={[styles.tabTitle, active && styles.tabTitleActive]}>{title}</Text>
  </Touchable>
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#3D2037',
    height: px(52.5),
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabTitle: {
    color: '#ccc',
    fontSize: px(13.5),
  },
  tabTitleActive: {
    color: '#fff',
    fontWeight: '700',
  },
});

const mapStateToProps = (state: RootState) => ({
  currentUser: meSelector(state),
});

export default connect(mapStateToProps)(BottomTabbar);
