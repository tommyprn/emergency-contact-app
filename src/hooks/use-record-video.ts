import {useRef, useState, useCallback} from 'react';
import type {Camera} from 'react-native-vision-camera';
import {
  saveVideoToAppStorage /*, saveVideoToGallery */,
} from '../utils/file-storage';

export function useRecordVideo() {
  const cameraRef = useRef<Camera>(null);
  const [isRecording, setRecording] = useState(false);
  const [lastSavedPath, setLastSavedPath] = useState<string | null>(null);

  const start = useCallback(async () => {
    if (!cameraRef.current || isRecording) return;
    setRecording(true);
    await cameraRef.current.startRecording({
      fileType: 'mp4', // atau 'mov' di iOS
      onRecordingFinished: async video => {
        try {
          // video.path = path sementara (temp)
          const stored = await saveVideoToAppStorage(video.path);
          setLastSavedPath(stored);

          // Opsional: juga simpan ke Gallery
          // await saveVideoToGallery(stored);
        } finally {
          setRecording(false);
        }
      },
      onRecordingError: e => {
        console.warn('Recording error', e);
        setRecording(false);
      },
    });
  }, [isRecording]);

  const stop = useCallback(async () => {
    if (!cameraRef.current || !isRecording) return;
    await cameraRef.current.stopRecording();
  }, [isRecording]);

  return {cameraRef, start, stop, isRecording, lastSavedPath};
}
