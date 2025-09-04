import {useRef, useState, useCallback} from 'react';
import {Camera, useCameraDevice} from 'react-native-vision-camera';
// import CameraRoll from '@react-native-camera-roll/camera-roll';

export function useRecorder() {
  // Langsung pilih kamera belakang:
  const device = useCameraDevice('back');
  const cameraRef = useRef<Camera>(null);
  const [recording, setRecording] = useState(false);
  const [lastFile, setLastFile] = useState<string | undefined>();

  const start = useCallback(async () => {
    if (!cameraRef.current || !device) return;
    setRecording(true);
    // VisionCamera v4: startRecording() tidak return promise yang resolve ke file;
    // kita pakai callback onRecordingFinished untuk dapat path.
    await cameraRef.current.startRecording({
      flash: 'off',
      onRecordingFinished: async video => {
        setLastFile(video.path);
        setRecording(false);
        // try { await CameraRoll.save(video.path, { type: 'video' }); } catch {}
      },
      onRecordingError: e => {
        setRecording(false);
        console.warn(e);
      },
    });
  }, [device]);

  const stop = useCallback(async () => {
    if (!cameraRef.current) return;
    await cameraRef.current.stopRecording();
  }, []);

  return {device, cameraRef, recording, lastFile, start, stop};
}
