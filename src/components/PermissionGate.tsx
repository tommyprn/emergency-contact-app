import React, {useState} from 'react';
import {Pressable, Text, ActivityIndicator, StyleSheet} from 'react-native';
import {openWhatsApp} from '../utils/whatsapp';

type Props = {
  label?: string;
  phoneE164: string;
  presetText?: string;
  onError?: (err: unknown) => void;
};

export default function WhatsAppButton({
  label = 'Contact Rasguard (WhatsApp)',
  onError,
  phoneE164,
  presetText = 'Halo Rasguard, saya butuh bantuan.',
}: Props) {
  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    try {
      setLoading(true);
      await openWhatsApp({phoneE164, text: presetText});
    } catch (e) {
      onError?.(e);
      // opsi: tampilkan toast/snackbar
      console.warn('Failed to open WhatsApp', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Pressable style={styles.btn} onPress={handlePress} disabled={loading}>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Text style={styles.label}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: '#25D366', // hijau WA
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {color: 'white', fontWeight: '600'},
});
