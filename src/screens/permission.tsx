// src/screens/PermissionGate.tsx
import React, {useEffect, useMemo, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {View, Text, StyleSheet} from 'react-native';
import {
  toState,
  openAppSettings,
  checkCorePermissions,
  requestCorePermissions,
} from '../utils/permission-utils';

import Row from '../components/row';
import Button from '../components/button';

const GATE_DONE = 'rasguard:permission_gate_done';

type Props = {
  onAllGranted: () => void; // navigate ke Home
};

export default function PermissionGate({onAllGranted}: Props) {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<any>(null);

  const allGranted = useMemo(() => {
    if (!status) return false;
    return (
      toState(status.mic) === 'granted' &&
      toState(status.camera) === 'granted' &&
      toState(status.fineLocation) === 'granted' &&
      toState(status.coarseLocation) === 'granted'
    );
  }, [status]);

  const anyBlocked = useMemo(() => {
    if (!status) return false;
    return (
      toState(status.mic) === 'blocked' ||
      toState(status.camera) === 'blocked' ||
      toState(status.fineLocation) === 'blocked' ||
      toState(status.coarseLocation) === 'blocked'
    );
  }, [status]);

  useEffect(() => {
    (async () => {
      const first = await AsyncStorage.getItem(GATE_DONE);
      const res = await checkCorePermissions();
      setStatus({
        mic: res?.[Object.keys(res)[1] as any] ?? '',
        camera: res?.[Object.keys(res)[0] as any] ?? '',
        fineLocation: res?.[Object.keys(res)[2] as any] ?? '',
        coarseLocation: res?.[Object.keys(res)[3] as any] ?? '',
      });
      setLoading(false);

      if (first && Object.values(res).every(v => v === 'granted')) {
        onAllGranted();
      }
    })();
  }, [onAllGranted]);

  const handleRequest = async () => {
    setLoading(true);
    const res = await requestCorePermissions();
    const next = {
      mic: res[Object.keys(res)[1] as any],
      camera: res[Object.keys(res)[0] as any],
      fineLocation: res[Object.keys(res)[2] as any],
      coarseLocation: res[Object.keys(res)[3] as any],
    };
    setStatus(next);
    setLoading(false);

    const ok = Object.values(next).every(v => v === 'granted');
    if (ok) {
      await AsyncStorage.setItem(GATE_DONE, '1');
      onAllGranted();
    }
  };

  const handleOpenSettings = async () => {
    await openAppSettings();
  };

  return (
    <View style={custom.wrap}>
      <Text style={custom.title}>Allow Access to Stay Safe</Text>
      <Text style={custom.desc}>
        Rasguard membutuhkan akses Kamera, Mikrofon, dan Lokasi agar respon
        darurat bisa berjalan cepat saat Anda butuh bantuan.
      </Text>

      {!loading && status && (
        <View style={custom.card}>
          <Row label="Camera" value={toState(status.camera)} />
          <Row label="Microphone" value={toState(status.mic)} />
          <Row label="Location" value={toState(status.fineLocation)} />
        </View>
      )}

      {anyBlocked ? (
        <>
          <Text style={custom.help}>
            Beberapa izin diblokir permanen. Silakan buka pengaturan aplikasi
            dan aktifkan izin yang diminta.
          </Text>
          <Button onPress={handleOpenSettings} text="Open Settings" />
        </>
      ) : (
        <Button
          onPress={handleRequest}
          text={
            loading ? 'Checking…' : allGranted ? 'Continue' : 'Allow & Continue'
          }
          disabled={loading}
        />
      )}

      <Text style={custom.note}>
        Dengan menekan “Allow & Continue”, Anda menyetujui pemrosesan data
        sesuai Kebijakan Privasi kami. Rekaman hanya dipicu saat Anda
        mengaktifkan mode darurat atau sesuai pengaturan Anda.
      </Text>
    </View>
  );
}

const custom = StyleSheet.create({
  wrap: {
    flex: 1,
    padding: 20,
    gap: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {fontSize: 22, fontWeight: '700', color: '#e3e8f1'},
  desc: {
    color: '#e3e8f1',
  },
  card: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    gap: 8,
    width: '60%',
  },
  help: {
    color: '#e3e8f1',
  },
  note: {
    color: '#e3e8f1',
    fontSize: 12,
  },
});
