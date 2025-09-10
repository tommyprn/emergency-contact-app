import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default function LocationPill({lat, lon}: {lat?: number; lon?: number}) {
  if (lat == null || lon == null) return null;
  return (
    <View style={styles.pill}>
      <Text style={styles.txt}>
        {/* {lat.toFixed(5)}, {lon.toFixed(5)} */}
        {lat && lon ? 'Location sent to rasguard' : 'Finding location...'}
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#0A84FF',
    borderRadius: 16,
  },
  txt: {color: 'white', fontWeight: '600'},
});
