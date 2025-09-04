import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
export default function SettingsScreen() {
  return (
    <View style={s.wrap}>
      <Text style={s.txt}>Settings / Kontak darurat coming soon</Text>
    </View>
  );
}
const s = StyleSheet.create({
  wrap: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  txt: {color: '#333'},
});
