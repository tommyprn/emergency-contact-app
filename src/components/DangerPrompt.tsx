import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default function DangerPrompt() {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Apakah kamu sedang dalam bahaya?</Text>
      <Text style={styles.sub}>
        Tap tombol SOS jika ya, atau kembali jika aman.
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  wrap: {padding: 16, alignItems: 'center'},
  title: {fontSize: 22, fontWeight: '700', textAlign: 'center', color: '#111'},
  sub: {fontSize: 14, color: '#444', marginTop: 8, textAlign: 'center'},
});
