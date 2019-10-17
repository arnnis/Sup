import React, {Component, useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import px from '../utils/normalizePixel';
import Touchable from '../components/Touchable';

const BottomTabbar = ({navigationState, renderScene, onIndexChange, renderIcon}) => {
  return (
    <>
      {renderScene(navigationState.routes[navigationState.index])}
      <View style={styles.container}>
        {navigationState.routes.map((tab, index) => (
          <Tab
            title={tab.title}
            icon={renderIcon({route: tab})}
            onPress={() => onIndexChange(index)}
          />
        ))}
      </View>
    </>
  );
};
const Tab = ({title, icon, onPress}) => (
  <Touchable style={styles.tab} onPress={onPress}>
    {icon}
    <Text style={styles.tabTitle}>{title}</Text>
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
    color: '#fff',
    fontSize: px(13.5),
  },
});

export default BottomTabbar;
