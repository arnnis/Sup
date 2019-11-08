import React, {useContext, FC} from 'react';
import {View, StyleSheet, ViewStyle, Text} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import px from '../utils/normalizePixel';
import ThemeContext from '../contexts/theme';
import Touchable from './Touchable';

interface Props {
  style?: ViewStyle;
}

export const InfoBox: FC<Props> = ({children, style}) => {
  let {theme} = useContext(ThemeContext);
  return (
    <View style={[styles.container, {backgroundColor: theme.backgroundColor}, style]}>
      {React.Children.map(children, (child, i) => {
        return React.cloneElement(child, {
          isFirst: i === 0,
          isLast: React.Children.count(children) === i + 1,
        });
      })}
    </View>
  );
};

interface InfoRowProps {
  title: string;
  isLast?: boolean;
  isFirst?: boolean;
}

export const InfoRow: FC<InfoRowProps> = ({title, isLast, isFirst, children}) => {
  let {theme} = useContext(ThemeContext);
  return (
    <>
      <View
        style={{
          marginTop: !isFirst ? px(10) : 0,
          marginBottom: isFirst ? px(10) : 0,
        }}>
        <Text style={styles.infoTitle}>{title}</Text>
        <Text style={[styles.infoBody, {color: theme.foregroundColor}]}>{children}</Text>
      </View>
      {!isLast && <View style={{width: '100%', height: px(1), backgroundColor: '#ccc'}} />}
    </>
  );
};

interface ActionRowProps {
  icon?: string;
  onPress?(): void;
  isLast?: boolean;
  isFirst?: boolean;
}

export const ActionRow: FC<ActionRowProps> = ({icon, onPress, isFirst, isLast, children}) => {
  let {theme} = useContext(ThemeContext);
  return (
    <View>
      <Touchable
        onPress={onPress}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: !isFirst ? px(10) : px(0),
          marginBottom: isFirst ? px(10) : 0,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {icon && (
            <MaterialCommunityIcons
              name={icon}
              size={px(20)}
              style={{marginRight: px(5)}}
              color={theme.foregroundColor}
            />
          )}
          <Text style={[styles.actionTitle, {color: theme.foregroundColor}]}>{children}</Text>
        </View>

        <MaterialCommunityIcons name="chevron-right" size={px(25)} color={theme.foregroundColor} />
      </Touchable>
      {!isLast && <View style={{width: '100%', height: px(1), backgroundColor: '#ccc'}} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: px(20),
    borderRadius: px(15),
    paddingHorizontal: px(20),
    paddingVertical: px(12.5),
    marginTop: px(30),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.09,
    shadowRadius: 0.5,

    elevation: 0.5,
  },
  infoTitle: {
    color: '#A652A3',
    fontWeight: '700',
  },
  infoBody: {
    marginTop: px(5),
  },

  actionTitle: {
    fontSize: px(14),
  },
});
