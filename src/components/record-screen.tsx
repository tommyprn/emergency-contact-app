// RecordScreen.tsx
import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useMicrophonePermission,
} from 'react-native-vision-camera';
import {useRecordVideo} from '../hooks/use-record-video';

export default function RecordScreen() {
  const mic = useMicrophonePermission();
  const device = useCameraDevice('back');
  const {hasPermission, requestPermission} = useCameraPermission();
  const {cameraRef, start, stop, isRecording, lastSavedPath} = useRecordVideo();

  useEffect(() => {
    if (!hasPermission) requestPermission();
    if (!mic.hasPermission) mic.requestPermission();
  }, [hasPermission, mic.hasPermission]);

  if (!device) return <Text>No camera</Text>;

  return (
    <View style={{flex: 1}}>
      <Camera
        ref={cameraRef}
        style={{flex: 1}}
        device={device}
        isActive
        video={true}
        audio={true}
      />
      <View style={{padding: 16}}>
        {isRecording ? (
          <TouchableOpacity
            style={{backgroundColor: '#e56161', borderRadius: 3, padding: 10}}
            onPress={stop}>
            <Text
              style={{
                color: '#e3e8f1',
                textAlign: 'center',
                fontWeight: '700',
                fontSize: 18,
              }}>
              Stop
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{backgroundColor: '#75ba75', borderRadius: 3, padding: 10}}
            onPress={start}>
            <Text
              style={{
                color: '#e3e8f1',
                textAlign: 'center',
                fontWeight: '700',
                fontSize: 18,
              }}>
              Start
            </Text>
          </TouchableOpacity>
        )}
        {lastSavedPath ? (
          <Text style={{marginTop: 8, color: '#e3e8f1'}}>
            Saved: {lastSavedPath}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
