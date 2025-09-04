import {Platform, PermissionsAndroid} from 'react-native';
import {
  request,
  requestNotifications,
  PERMISSIONS,
  RESULTS,
  type Permission,
} from 'react-native-permissions';

export function usePermissions() {
  // Core permissions via react-native-permissions
  const camera = Platform.select<Permission>({
    ios: PERMISSIONS.IOS.CAMERA,
    android: PERMISSIONS.ANDROID.CAMERA,
    default: PERMISSIONS.ANDROID.CAMERA,
  })!;
  const mic = Platform.select<Permission>({
    ios: PERMISSIONS.IOS.MICROPHONE,
    android: PERMISSIONS.ANDROID.RECORD_AUDIO,
    default: PERMISSIONS.ANDROID.RECORD_AUDIO,
  })!;
  const locWhenInUse = Platform.select<Permission>({
    ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    default: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  })!;
  const locAlways = Platform.select<Permission>({
    ios: PERMISSIONS.IOS.LOCATION_ALWAYS,
    android: PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
    default: PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
  })!;

  async function ensureAll() {
    // 1) Kamera, Mic, Lokasi
    const corePerms: Permission[] = [camera, mic, locWhenInUse];
    if (Platform.OS === 'android') corePerms.push(locAlways);
    const coreResults = await Promise.all(
      corePerms.map(async p => ({p, r: await request(p)})),
    );
    const coreOk = coreResults.every(({resolve}: any) =>
      [RESULTS.GRANTED, RESULTS.LIMITED].includes(resolve),
    );

    // 2) Notifikasi — tanpa PERMISSIONS.*.NOTIFICATIONS
    let notifOk = true;
    if (Platform.OS === 'ios') {
      const {status} = await requestNotifications(['alert', 'sound', 'badge']);
      notifOk = status === 'granted';
    } else if (Platform.OS === 'android' && Platform.Version >= 33) {
      // Android 13+: minta POST_NOTIFICATIONS via RN core
      const res = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      notifOk = res === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      notifOk = true; // Android < 13 tidak perlu izin khusus
    }

    return {ok: coreOk && notifOk, details: {coreResults, notifOk}};
  }

  return {ensureAll};
}
