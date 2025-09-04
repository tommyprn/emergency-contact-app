import {useCallback} from 'react';
import BackgroundService from 'react-native-background-actions';

const task = async (taskData: any) => {
  const {delay = 1000} = taskData || {};
  for (;;) {
    await new Promise((resolve: any) => setTimeout(resolve, delay));
    // jalankan kerja periodikmu di sini bila perlu (atau gunakan Headless JS terpisah)
  }
};

export function useForegroundService() {
  const start = useCallback(
    async (title = 'Rasguard', desc = 'Emergency mode aktif') => {
      await BackgroundService.start(task, {
        taskName: 'RasguardSOS',
        taskTitle: title,
        taskDesc: desc,
        taskIcon: {name: 'ic_launcher', type: 'mipmap'}, // pastikan ada
        linkingURI: 'rasguard://emergency',
        parameters: {delay: 1000},
        // progressBar: { max: 100, value: 0, indeterminate: true }, // opsional
      });
    },
    [],
  );

  const stop = useCallback(async () => {
    await BackgroundService.stop();
  }, []);

  return {start, stop};
}
