import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import px from '../utils/normalizePixel';
import Touchable from '../components/Touchable';

const BottomTabbar = ({navigationState, renderScene, onIndexChange, renderIcon}) => {
  return (
    <>
      {renderScene(navigationState.routes[navigationState.index])}
      <View style={styles.container}>
        {navigationState.routes.map((tab, index) => {
          let active = index === navigationState.index;
          return (
            <Tab
              title={tab.title}
              icon={renderIcon({route: tab, focused: active})}
              onPress={() => onIndexChange(index)}
              active={active}
            />
          );
        })}
      </View>
    </>
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

export default BottomTabbar;
