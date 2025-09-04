import React from 'react';
import {View, StyleSheet} from 'react-native';
import SOSButton from '../components/SOSButton';
import DangerPrompt from '../components/DangerPrompt';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../app/AppNavigator';

export default function HomeScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'Home'>) {
  return (
    <View style={s.wrap}>
      <DangerPrompt />
      <SOSButton onPress={() => navigation.navigate('Emergency')} />
    </View>
  );
}
const s = StyleSheet.create({
  wrap: {flex: 1, alignItems: 'center', justifyContent: 'center'},
});
