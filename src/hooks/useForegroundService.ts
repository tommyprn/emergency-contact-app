// hooks/useForegroundService.ts
import notifee, {AndroidImportance} from '@notifee/react-native';
import {Platform} from 'react-native';

export function useForegroundService() {
  async function ensureNotifPermission() {
    if (Platform.OS === 'android') {
      // Android 13+: butuh POST_NOTIFICATIONS
      await notifee.requestPermission();
    }
  }

  async function start(title: string, body: string) {
    await ensureNotifPermission();

    const channelId = await notifee.createChannel({
      id: 'rasguard-fg',
      name: 'Rasguard Foreground',
      importance: AndroidImportance.HIGH,
    });

    // Tampilkan notifikasi sebagai Foreground Service (ini akan memanggil startForeground di native)
    await notifee.displayNotification({
      title,
      body,
      android: {
        channelId,
        asForegroundService: true,
        ongoing: true,
        pressAction: {id: 'default'},
      },
    });
  }

  async function stop() {
    // Matikan semua notifikasi foreground service kita
    const notifs = await notifee.getDisplayedNotifications();
    await Promise.all(
      notifs
        .filter(n => n.notification.android?.asForegroundService)
        .map(n => notifee.cancelDisplayedNotification(n.id!)),
    );
  }

  return {start, stop};
}
