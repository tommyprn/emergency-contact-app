// App.tsx (ringkas)
import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

type Root = {
  Home: undefined;
  Emergency: undefined;
  PermissionGate: undefined;
};

const Stack = createNativeStackNavigator<Root>();

export default function App() {
  return <View></View>;
}

const custom = StyleSheet.create({
  note: {color: '#6b7280', fontSize: 12},
});
