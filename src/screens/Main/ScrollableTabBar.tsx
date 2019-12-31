import React, {useState} from 'react';
import {View, Dimensions} from 'react-native';
import {TabView, TabBar, SceneMap} from 'react-native-tab-view';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import px from '../../utils/normalizePixel';
import DirectsList from '../DirectsList';
import ChannelsList from '../ChannelsList';

const ScrollableTabView = () => {
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

  let _handleScrollableTabIndexChange = index =>
    setScrollableTabState({...scrollableTabState, index});

  let _renderScrollableTabScene = SceneMap({
    directs: DirectsList,
    channels: ChannelsList,
  } as any);

  let _renderTabIcon = ({route, focused, color}) => (
    <MaterialCommunityIcons name={route.icon} color={focused ? '#fff' : '#ccc'} size={px(19)} />
  );

  return (
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
              backgroundColor: '#492146',
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
};

export default ScrollableTabView;
