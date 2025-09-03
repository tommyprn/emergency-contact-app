import {Linking} from 'react-native';

export type WhatsAppParams = {
  phoneE164: string;
  text?: string;
};

const enc = (s: string) => encodeURIComponent(s);

export async function openWhatsApp({phoneE164, text = ''}: WhatsAppParams) {
  const normalized = phoneE164.replace(/[^0-9+]/g, '');

  const payload = `?phone=${normalized}&text=${enc(text)}`;

  const businessScheme = `whatsapp-business://send${payload}`;
  const consumerScheme = `whatsapp://send${payload}`;
  const webLink = `https://wa.me/${normalized.replace('+', '')}${
    text ? `?text=${enc(text)}` : ''
  }`;

  // coba WA Business dulu
  const canOpenBusiness = await Linking.canOpenURL(businessScheme);
  if (canOpenBusiness) {
    return Linking.openURL(businessScheme);
  }

  // lalu WA reguler
  const canOpenConsumer = await Linking.canOpenURL(consumerScheme);
  if (canOpenConsumer) {
    return Linking.openURL(consumerScheme);
  }

  // terakhir: fallback ke web
  return Linking.openURL(webLink);
}
