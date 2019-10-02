import React from "react";
import { Text } from 'react-native'
import Ionicons from "react-native-vector-icons/Ionicons";
import px from "../utils/normalizePixel";

interface Props {
  name: string;
  focused: boolean;
}

export default function TabBarIcon(props: Props) {
  return (
    <Text
      // name={props.name}
      // size={px(26)}
      // style={{ marginBottom: -px(3) }}
      // color={props.focused ? "red" : "#333333"}
    >
      x
    </Text>
  );
}
