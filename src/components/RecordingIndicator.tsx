import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default function RecordingIndicator({active}: {active: boolean}) {
  if (!active) return null;
  return (
    <View style={styles.badge}>
      <View style={styles.dot} />
      <Text style={styles.txt}>REC</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF3B30',
    marginRight: 6,
  },
  txt: {color: 'white', fontWeight: '700', letterSpacing: 1},
});
