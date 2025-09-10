import React, {useCallback, useState} from 'react';
import {Camera} from 'react-native-vision-camera';
import {sendSOS} from '../hooks/useInfobip';
import {useRecorder} from '../hooks/useRecorder';
import {useSOSStore} from '../store/sosStore';
import {requestWACall} from '../utils/sos';
import {useWhatsAppLink} from '../hooks/useWhatsAppLink';
import {useLocationStream} from '../hooks/useLocationStream';
import {useForegroundService} from '../hooks/useForegroundService';
import {View, StyleSheet, Pressable, Text, Alert} from 'react-native';

import LocationPill from '../components/LocationPill';
import RecordingIndicator from '../components/RecordingIndicator';

const RASGUARD_PHONE = '628179196363'; // ganti dari env/config
const USER_MSISDN = '6281931197146';
export default function EmergencyScreen() {
  const {device, cameraRef, recording, lastFile, start, stop} = useRecorder();
  const {isActive, setActive} = useSOSStore();
  const {start: startFg, stop: stopFg} = useForegroundService();
  const [coord, setCoord] = useState<{lat?: number; lon?: number}>({});
  const wa = useWhatsAppLink(RASGUARD_PHONE);

  useLocationStream({
    active: isActive,
    intervalMs: 5000,
    onPoint: p => setCoord({lat: p.coords.latitude, lon: p.coords.longitude}),
  });

  const onStart = useCallback(async () => {
    try {
      setActive(true);
      await startFg('Rasguard', 'Emergency mode aktif');
      await start();
      const text = `SOS: butuh bantuan. Lokasi awal: ${coord.lat ?? '-'}, ${
        coord.lon ?? '-'
      }`;
      const resp = await requestWACall({
        userPhoneE164: USER_MSISDN,
        location:
          coord.lat && coord.lon ? {lat: coord.lat, lon: coord.lon} : undefined,
        photoUrl: '',
      });
      // if (resp.status === 'permission_sent') {
      //   Alert.alert('SOS terkirim', 'Meminta izin panggilan WhatsApp…');
      // } else {
      //   Alert.alert('Status', resp.status);
      // }
    } catch (e) {
      console.warn(e);
      Alert.alert('Gagal SOS Terjadi kesalahan.');
      setTimeout(async () => await stop(), 2000);
      await stopFg();
      setActive(false);
    }
  }, [coord, setActive, startFg, start, stop, stopFg]);

  const onStop = useCallback(async () => {
    try {
      await stop(); // stop recorder/camera
      setTimeout(async () => await stop(), 2000);
    } finally {
      await stopFg(); // hentikan foreground service
      setActive(false);
      sendSOS({
        text: 'Orang ini butuh bantuan!! Cepat bergerak selamatkan warga!',
        lat: coord.lat,
        lon: coord.lon,
        photoUrl: null,
        audioUrl: null,
      });
    }
  }, [stop, stopFg, setActive]);

  const isObjectEmpty = (obj: any) => {
    if (typeof obj !== 'object' || obj === null) {
      return false;
    }

    return Object.keys(obj).length === 0;
  };

  return (
    <View style={s.wrap}>
      <View style={s.topBar}>
        <LocationPill lat={coord.lat} lon={coord.lon} />
        <RecordingIndicator active={recording || isActive} />
      </View>

      {device ? (
        <Camera
          ref={cameraRef}
          style={s.camera}
          device={device}
          isActive={true}
          video={true}
          audio={true}
        />
      ) : (
        <View style={[s.camera, s.center]}>
          <Text>Tidak ada kamera</Text>
        </View>
      )}

      <View style={s.row}>
        {!isActive ? (
          <Pressable style={[s.btn, s.btnDanger]} onPress={onStart}>
            <Text style={s.btnTxt}>Mulai SOS</Text>
          </Pressable>
        ) : isObjectEmpty(coord) ? (
          <Text style={[s.loadTxt]}>Loading...</Text>
        ) : (
          <Pressable style={[s.btn, s.btnStop]} onPress={onStop}>
            <Text style={s.btnTxt}>Stop</Text>
          </Pressable>
        )}
      </View>

      {lastFile ? <Text style={s.path}>Last file: {lastFile}</Text> : null}
    </View>
  );
}
const s = StyleSheet.create({
  wrap: {flex: 1, backgroundColor: '#000'},
  camera: {flex: 1},
  center: {alignItems: 'center', justifyContent: 'center'},
  row: {flexDirection: 'row', padding: 16, gap: 12, justifyContent: 'center'},
  btn: {paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10},
  btnDanger: {backgroundColor: '#FF3B30'},
  btnStop: {backgroundColor: '#111'},
  btnTxt: {color: 'white', fontWeight: '800'},
  loadTxt: {color: 'white'},
  topBar: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 14,
    zIndex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  path: {color: '#aaa', padding: 12, fontSize: 12},
});
