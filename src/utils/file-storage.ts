import RNFS from 'react-native-fs';
// import {Platform} from 'react-native';
// import CameraRoll from '@react-native-camera-roll/camera-roll';

const SUBDIR_VIDEO = 'videos';
const SUBDIR_AUDIO = 'audios';

function appDir(subdir?: string) {
  const base = RNFS.DocumentDirectoryPath; // iOS & Android app-specific
  return subdir ? `${base}/${subdir}` : base;
}

async function ensureDir(dir: string) {
  const exists = await RNFS.exists(dir);
  if (!exists) await RNFS.mkdir(dir);
}

function filenameWithExt(prefix: string, ext: string) {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  return `${prefix}_${stamp}.${ext}`;
}

export async function saveVideoToAppStorage(
  tempFilePath: string,
): Promise<string> {
  const dir = appDir(SUBDIR_VIDEO);
  await ensureDir(dir);
  const ext = tempFilePath.split('.').pop() || 'mp4';
  const target = `${dir}/${filenameWithExt('video', ext)}`;
  await RNFS.moveFile(tempFilePath, target);
  return target; // return path di storage aplikasi
}

export async function saveAudioToAppStorage(
  tempFilePath: string,
): Promise<string> {
  const dir = appDir(SUBDIR_AUDIO);
  await ensureDir(dir);
  const ext = tempFilePath.split('.').pop() || 'm4a';
  const target = `${dir}/${filenameWithExt('audio', ext)}`;
  await RNFS.moveFile(tempFilePath, target);
  return target;
}

/**
 * Opsional: simpan ke Gallery / Photos (shared storage)
 * - iOS: otomatis masuk Photos (butuh permission Photos di iOS 14+ untuk read, write tidak selalu perlu)
 * - Android 13+: butuh READ_MEDIA_VIDEO / READ_MEDIA_AUDIO saat mau baca; untuk write via CameraRoll tidak perlu WRITE_EXTERNAL_STORAGE.
 */
// export async function saveVideoToGallery(filePath: string): Promise<string> {
//   const uri = Platform.select({
//     ios: `file://${filePath}`,
//     android: `file://${filePath}`,
//   })!;
//   const savedUri = await CameraRoll.saveAsset(uri, { type: 'video' });
//   return savedUri;
// }
