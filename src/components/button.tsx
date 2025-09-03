import {Text, StyleSheet, TouchableOpacity} from 'react-native';

export default function Button({
  text,
  onPress,
  disabled,
}: {
  text: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[custom.btn, disabled && {opacity: 0.6}]}>
      <Text style={custom.btnText}>{text}</Text>
    </TouchableOpacity>
  );
}

const custom = StyleSheet.create({
  btn: {
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: 12,
    backgroundColor: '#16a34a',
  },
  btnText: {color: 'white', fontWeight: '700'},
});
