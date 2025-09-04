// usePermissions.ts (potongan)
import {Platform, PermissionsAndroid} from 'react-native';
import {
  check,
  request,
  checkNotifications,
  requestNotifications,
  PERMISSIONS,
  RESULTS,
  type Permission,
} from 'react-native-permissions';

const CAMERA = Platform.select({
  ios: PERMISSIONS.IOS.CAMERA,
  android: PERMISSIONS.ANDROID.CAMERA,
})!;
const MIC = Platform.select({
  ios: PERMISSIONS.IOS.MICROPHONE,
  android: PERMISSIONS.ANDROID.RECORD_AUDIO,
})!;
const LOC_FG = Platform.select({
  ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
  android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
})!;

const isGranted = (r: any) => r === RESULTS.GRANTED || r === RESULTS.LIMITED;

export async function checkAll() {
  const corePerms: Permission[] = [CAMERA, MIC, LOC_FG];

  const coreStatuses = await Promise.all(corePerms.map(p => check(p)));
  const coreOk = coreStatuses.every(isGranted);

  // Notifications (no PERMISSIONS.*.NOTIFICATIONS)
  let notifOk = true;
  if (Platform.OS === 'ios') {
    const {status} = await checkNotifications();
    notifOk = status === 'granted';
  } else if (Platform.OS === 'android' && Platform.Version >= 33) {
    notifOk = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
  }

  return {ok: coreOk && notifOk, details: {coreStatuses, notifOk}};
}

async function ensureOne(p: Permission, label: string) {
  // 1) Cek dulu
  const s = await check(p);

  if (isGranted(s)) {
    return s;
  }
  if (s === RESULTS.BLOCKED || s === RESULTS.UNAVAILABLE) {
    return s; // jangan panggil request kalau BLOCKED/UNAVAILABLE
  }

  // 2) Minta (dengan timeout guard supaya tidak “gantung” selamanya)
  const ask = request(p);
  const timed = Promise.race([
    ask,
    new Promise<any>(
      resolve => setTimeout(() => resolve(RESULTS.DENIED), 15000), // 15s guard
    ),
  ]);
  const r = await timed;
  return r;
}

export async function ensureAll() {
  // urut: Camera -> Mic -> Location (FG). (BG location JANGAN bareng!)

  const results: Record<string, any> = {};

  results.camera = await ensureOne(CAMERA, 'camera');
  results.microphone = await ensureOne(MIC, 'microphone');
  results.locationWhenInUse = await ensureOne(LOC_FG, 'location when-in-use');

  // ⚠️ Background location minta TERPISAH setelah FG GRANTED (kalau memang perlu)
  // const LOC_BG = Platform.select({
  //   ios: PERMISSIONS.IOS.LOCATION_ALWAYS,
  //   android: PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
  // })!;
  // if (isGranted(results.locationWhenInUse)) {
  //   results.locationAlways = await ensureOne(LOC_BG, 'background location');
  // } else {
  //   results.locationAlways = RESULTS.DENIED;
  // }

  const coreOk =
    isGranted(results.camera) &&
    isGranted(results.microphone) &&
    isGranted(results.locationWhenInUse);

  // Notifications
  let notifOk = true;
  if (coreOk && Platform.OS === 'ios') {
    const {status} = await requestNotifications(['alert', 'sound', 'badge']);
    notifOk = status === 'granted';
  } else if (coreOk && Platform.OS === 'android' && Platform.Version >= 33) {
    const res = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    notifOk = res === PermissionsAndroid.RESULTS.GRANTED;
  }

  const ok = coreOk && notifOk;
  return {
    ok,
    details: {
      ...results,
      notifications: notifOk ? RESULTS.GRANTED : RESULTS.DENIED,
    },
  };
}
