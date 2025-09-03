import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

import WhatsAppButton from '../components/whatsapp-button';

export default function HomeScreen({navigation}: any) {
  const RASGUARD_WA = '+628179196363';

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
      }}>
      <Text style={{fontSize: 18, fontWeight: '600', color: '#e3e8f1'}}>
        Are you in immediate danger?
      </Text>

      <View style={custom.view}>
        <TouchableOpacity onPress={() => null} style={[custom.danger_btn]}>
          <Text style={custom.btnText}>NO</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Emergency')}
          style={[custom.btn]}>
          <Text style={custom.btnText}>YES</Text>
        </TouchableOpacity>
      </View>

      <View style={{gap: 16, padding: 16}}>
        <Text style={{fontSize: 18, fontWeight: '700'}}>Emergency Contact</Text>
        <WhatsAppButton
          phoneE164={RASGUARD_WA}
          presetText={
            'EMERGENCY: Saya butuh bantuan sekarang. [Auto-from Rasguard App]'
          }
          label="Contact Rasguard (WhatsApp)"
        />
      </View>
    </View>
  );
}

const custom = StyleSheet.create({
  btn: {
    minWidth: 90,
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: 12,
    backgroundColor: '#16a34a',
  },
  danger_btn: {
    minWidth: 90,
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: 12,
    backgroundColor: '#f42619',
  },
  view: {
    gap: 20,
    display: 'flex',
    flexDirection: 'row',
  },
  btnText: {color: 'white', fontWeight: '700'},
});
