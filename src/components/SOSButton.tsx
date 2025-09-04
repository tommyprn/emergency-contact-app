import React from 'react';
import {Pressable, Text, StyleSheet, ViewStyle} from 'react-native';

export default function SOSButton({
  onPress,
  style,
}: {
  onPress: () => void;
  style?: ViewStyle;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => [styles.btn, style, pressed && {opacity: 0.8}]}>
      <Text style={styles.txt}>SOS</Text>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  btn: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#FF3B30',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
  txt: {color: 'white', fontSize: 48, fontWeight: '800', letterSpacing: 4},
});
