import {Alert, Linking} from 'react-native';

export async function openWhatsApp({
  text,
  phoneE164,
}: {
  text: string;
  phoneE164: string;
}) {
  const txt = encodeURIComponent(text);
  const candidates = [
    `whatsapp-business://send?phone=${phoneE164}&text=${txt}`,
    `whatsapp://send?phone=${phoneE164}&text=${txt}`,
    `https://wa.me/${phoneE164.replace('+', '')}${txt ? `?text=${txt}` : ''}`,
  ];
  console.log(candidates);

  for (const url of candidates) {
    const can = await Linking.canOpenURL(url);
    if (can) {
      await Linking.openURL(url);
      return true;
    }
  }
  return false;
  // return Alert.alert('konek ke whatsapp');
}
