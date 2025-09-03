import {View, Text, StyleSheet} from 'react-native';

export default function Row({
  label,
  value,
}: {
  label: string;
  value: 'granted' | 'denied' | 'blocked';
}) {
  const color =
    value === 'granted'
      ? '#16a34a'
      : value === 'blocked'
      ? '#dc2626'
      : '#ca8a04';
  return (
    <View style={custom.row}>
      <Text style={custom.rowLabel}>{label}</Text>
      <Text style={[custom.rowValue, {color}]}>{value}</Text>
    </View>
  );
}

const custom = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowLabel: {fontWeight: '600', color: '#e3e8f1'},
  rowValue: {fontWeight: '700', textTransform: 'capitalize'},
});
