import React, {useContext, FC} from 'react';
import {View, StyleSheet, ViewStyle, Text, Switch, ActivityIndicator, Platform} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import px from '../utils/normalizePixel';
import ThemeContext from '../contexts/theme';
import Touchable from './Touchable';
import {DispatchProp} from 'react-redux';
import {togglePresence} from '../actions/app/thunks';

interface Props {
  style?: ViewStyle;
}

export const InfoBox: FC<Props> = ({children, style}) => {
  let {theme} = useContext(ThemeContext);
  return (
    <View style={[styles.container, {backgroundColor: theme.backgroundColor}, style]}>
      {React.Children.map(children, (child, i) => {
        const isFirst = i === 0;
        const isLast = React.Children.count(children) === i + 1;
        if (!React.isValidElement(child)) return null;
        // Adds a Divider and padding to each child. ( all child Must have a style propery for parent )
        return (
          <View>
            {React.cloneElement(child, {
              isFirst: i === 0,
              isLast: React.Children.count(children) === i + 1,
              style: {paddingBottom: !isLast ? px(10) : 0, paddingTop: !isFirst ? px(10) : 0},
            })}
            {!isLast && (
              <View
                style={{width: '100%', height: StyleSheet.hairlineWidth, backgroundColor: '#ccc'}}
              />
            )}
          </View>
        );
      })}
    </View>
  );
};

interface InfoRowProps {
  title: string;
  isLast?: boolean;
  isFirst?: boolean;
  style?: ViewStyle;
}

export const InfoRow: FC<InfoRowProps> = ({title, isLast, isFirst, style, children}) => {
  let {theme} = useContext(ThemeContext);
  return (
    <>
      <View style={style}>
        <Text style={styles.infoTitle}>{title}</Text>
        <Text style={[styles.infoBody, {color: theme.foregroundColor}]}>{children}</Text>
      </View>
    </>
  );
};

interface ActionRowProps {
  icon?: string;
  onPress?(): void;
  isLast?: boolean;
  isFirst?: boolean;
  style?: ViewStyle;
}

export const ActionRow: FC<ActionRowProps> = ({icon, onPress, style, children}) => {
  let {theme} = useContext(ThemeContext);
  return (
    <Touchable
      onPress={onPress}
      style={[
        style,
        {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        },
      ]}>
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
  );
};

type SwitchRowProps = {
  icon?: string;
  isLast?: boolean;
  isFirst?: boolean;
  style?: ViewStyle;
  value: boolean;
  onValueChange(value: boolean): void;
  changing?: boolean;
};

export const SwitchRow: FC<SwitchRowProps> = ({
  icon,
  style,
  value,
  onValueChange,
  changing,
  children,
}) => {
  let {theme} = useContext(ThemeContext);
  return (
    <Touchable
      onPress={() => onValueChange(!value)}
      style={[
        style,
        {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        },
      ]}>
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

      {!changing ? (
        <Switch onValueChange={onValueChange} value={value || false} />
      ) : (
        <ActivityIndicator size={'small'} color={theme.foregroundColor} />
      )}
    </Touchable>
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
