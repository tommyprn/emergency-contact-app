// src/lib/permissionUtils.ts
import {Platform} from 'react-native';
import {
  RESULTS,
  PERMISSIONS,
  openSettings,
  checkMultiple,
  requestMultiple,
  type PermissionStatus, // ⬅️ pakai tipe resmi
} from 'react-native-permissions';

export type PermissionState = 'granted' | 'denied' | 'blocked';

export const PERMS = {
  // camera: Platform.select({
  //   ios: PERMISSIONS.IOS.CAMERA,
  //   android: PERMISSIONS.ANDROID.CAMERA,
  // })!,
  mic: Platform.select({
    ios: PERMISSIONS.IOS.MICROPHONE,
    android: PERMISSIONS.ANDROID.RECORD_AUDIO,
  })!,
  // fineLocation: Platform.select({
  //   ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
  //   android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  // })!,
  // coarseLocation: Platform.select({
  //   ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE, // iOS share
  //   android: PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
  // })!,
};

export async function checkCorePermissions() {
  return checkMultiple([
    PERMS.mic,
    // PERMS.camera,
    // PERMS.fineLocation,
    // PERMS.coarseLocation,
  ]) as any;
}

export function toState(v?: PermissionStatus): PermissionState {
  switch (v) {
    case RESULTS.GRANTED:
      return 'granted';
    case RESULTS.BLOCKED:
      return 'blocked';
    default:
      return 'denied';
  }
}

export async function requestCorePermissions() {
  return requestMultiple([
    // PERMS.camera,
    PERMS.mic,
    // PERMS.fineLocation,
    // PERMS.coarseLocation,
  ]) as any;
}

export async function ensureAllGranted() {
  const res = await checkCorePermissions();
  const all = [
    // res[PERMS.camera],
    res[PERMS.mic],
    // res[PERMS.fineLocation],
    // res[PERMS.coarseLocation],
  ];
  return all.every(v => v === RESULTS.GRANTED);
}

export function openAppSettings() {
  return openSettings();
}
