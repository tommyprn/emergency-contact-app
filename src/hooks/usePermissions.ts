// usePermissions.ts
import {Platform, PermissionsAndroid} from 'react-native';
import {
  check,
  checkNotifications,
  request,
  requestNotifications,
  PERMISSIONS,
  RESULTS,
  type Permission,
} from 'react-native-permissions';

export function usePermissions() {
  // Core permissions
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

  const isGranted = (r: any) => r === RESULTS.GRANTED || r === RESULTS.LIMITED;

  // ✅ Passive check (no prompts)
  async function checkAll() {
    const corePerms: Permission[] = [camera, mic, locWhenInUse];
    if (Platform.OS === 'android') corePerms.push(locAlways);

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

  // 🚀 Active request (prompts user) — fixed the bug here
  async function ensureAll() {
    const corePerms: Permission[] = [camera, mic, locWhenInUse];
    if (Platform.OS === 'android') corePerms.push(locAlways);

    // Request and evaluate results directly
    const coreResults = await Promise.all(corePerms.map(p => request(p)));
    const coreOk = coreResults.every(isGranted); // <-- was `{resolve}` before

    let notifOk = true;
    if (Platform.OS === 'ios') {
      const {status} = await requestNotifications(['alert', 'sound', 'badge']);
      notifOk = status === 'granted';
    } else if (Platform.OS === 'android' && Platform.Version >= 33) {
      const res = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      notifOk = res === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      notifOk = true;
    }

    return {ok: coreOk && notifOk, details: {coreResults, notifOk}};
  }

  return {ensureAll, checkAll};
}
