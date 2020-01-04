import React, {useState} from 'react';
import {View, Text, Dimensions, StyleSheet} from 'react-native';
import {TabView, TabBar, SceneMap} from 'react-native-tab-view';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import px from '../../utils/normalizePixel';
import DirectsList from '../DirectsList';
import ChannelsList from '../ChannelsList';
import {RootState} from '../../reducers';
import {
  totalDirectsUnreadCountSelector,
  totalChannelsUnreadCountSelector,
} from '../../reducers/chats';
import {useSelector} from 'react-redux';

const ScrollableTabView = () => {
  const [scrollableTabState, setScrollableTabState] = useState({
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

  const totalDirectsUnreadCount = useSelector(totalDirectsUnreadCountSelector);
  const totalChannelsUnreadCount = useSelector(totalChannelsUnreadCountSelector);

  const _handleScrollableTabIndexChange = index =>
    setScrollableTabState({...scrollableTabState, index});

  const _renderScrollableTabScene = SceneMap({
    directs: DirectsList,
    channels: ChannelsList,
  } as any);

  const _renderTabIcon = ({route, focused, color}) => (
    <MaterialCommunityIcons name={route.icon} color={focused ? '#fff' : '#ccc'} size={px(19)} />
  );

  const _renderBadge = ({route}) => {
    let content = 0;

    if (route.key === 'directs') {
      content = totalDirectsUnreadCount;
    }
    if (route.key === 'channels') {
      content = totalChannelsUnreadCount;
    }

    if (content === 0) return null;

    return (
      <View style={styles.unreadBadge}>
        <Text style={styles.unreadBadgeText}>{content}</Text>
      </View>
    );
  };

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
            renderBadge={_renderBadge}
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

const styles = StyleSheet.create({
  unreadBadge: {
    paddingHorizontal: px(4),
    paddingVertical: px(3),
    borderRadius: px(360),
    backgroundColor: '#fff',
  },
  unreadBadgeText: {
    color: '#333',
    fontSize: px(10.5),
    fontWeight: 'bold',
  },
});

export default ScrollableTabView;
