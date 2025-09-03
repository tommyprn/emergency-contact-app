import {StyleSheet} from 'react-native';

import RecordScreen from '../components/record-screen';

export default function EmergencyScreen() {
  // const device = useCameraDevice('back');
  // const ref = useRef<Camera>(null);

  // const start = async () => {
  //   if (!ref.current) return;
  //   ref.current.startRecording({
  //     onRecordingFinished: video => {
  //       console.log('saved:', video.path);
  //     },
  //     onRecordingError: e => console.warn('record error', e),
  //   });
  // };

  // const stop = async () => {
  //   try {
  //     await ref.current?.stopRecording();
  //   } catch {}
  // };

  return (
    <RecordScreen />
    // <View style={{flex: 1}}>
    //   {device && (
    //     <Camera
    //       ref={ref}
    //       style={{flex: 1}}
    //       device={device}
    //       isActive
    //       video
    //       audio
    //     />
    //   )}
    //   <View style={custom.actions}>
    //     <TouchableOpacity style={custom.btn} onPress={start}>
    //       <Text style={custom.btnText}>Start</Text>
    //     </TouchableOpacity>
    //     <TouchableOpacity
    //       style={[custom.btn, {backgroundColor: '#ef4444'}]}
    //       onPress={stop}>
    //       <Text style={custom.btnText}>Stop</Text>
    //     </TouchableOpacity>
    //   </View>
    // </View>
  );
}

const custom = StyleSheet.create({
  actions: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 20,
    flexDirection: 'row',
    gap: 12,
  },
  btn: {
    flex: 1,
    backgroundColor: '#16a34a',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnText: {color: 'white', fontWeight: '700'},
});
