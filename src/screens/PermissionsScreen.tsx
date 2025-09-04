// PermissionsScreen.tsx
import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {usePermissions} from '../hooks/usePermissions';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../app/AppNavigator';

export default function PermissionsScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'Permissions'>) {
  const {ensureAll, checkAll} = usePermissions();
  const [loading, setLoading] = useState(false);

  // 👇 On mount: silently check and redirect if already approved
  useEffect(() => {
    (async () => {
      const res = await checkAll();
      if (res.ok) navigation.replace('Home');
    })();
  }, [navigation, checkAll]);

  const onContinue = async () => {
    setLoading(true);
    const res = await ensureAll();
    setLoading(false);
    if (res.ok) navigation.replace('Home');
  };

  return (
    <View style={s.wrap}>
      <Text style={s.title}>Izin Diperlukan</Text>
      <Text style={s.sub}>
        Kamera, Mikrofon, Lokasi, dan Notifikasi diperlukan untuk mode darurat.
      </Text>
      <Pressable
        onPress={onContinue}
        style={[s.btn, loading && {opacity: 0.6}]}>
        <Text style={s.btnTxt}>
          {loading ? 'Memeriksa/Meminta izin...' : 'Izinkan & Lanjut'}
        </Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24},
  title: {fontSize: 24, fontWeight: '800', marginBottom: 8},
  sub: {textAlign: 'center', color: '#444', marginBottom: 24},
  btn: {
    backgroundColor: '#0A84FF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  btnTxt: {color: 'white', fontWeight: '700'},
});
