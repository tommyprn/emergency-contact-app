import {INFOPB_API_KEY, INFOPB_BASE_URL, INFOPB_SENDER} from '../config';

export async function sendSOSMessage(
  phone: string,
  text: string,
  location?: {lat: number; lon: number},
  mediaUrl?: string,
) {
  const payload: any = {
    from: INFOPB_SENDER, // WA business number
    to: phone,
    message: {
      content: {
        text: `${text}\n📍 https://maps.google.com/?q=${location?.lat},${location?.lon}`,
      },
    },
  };
  await fetch(`${INFOPB_BASE_URL}/whatsapp/1/message/text`, {
    method: 'POST',
    headers: {
      Authorization: `App ${INFOPB_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}
