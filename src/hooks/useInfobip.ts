import axios from 'axios';
import {Alert} from 'react-native';

const API_KEY =
  '11575c9f2b2bbdfb2bbf027972d5acbb-31319462-6cbd-4641-930f-302a511cea7f';
const BASE_URL = 'https://d9vkjv.api.infobip.com';
const WHATSAPP_SENDER = '447860088970'; // nomor WA API dari Infobip
const DESTINATION = '31645346393';

export async function sendSOS({text, lat, lon, photoUrl, audioUrl}: any) {
  const payload = {
    from: WHATSAPP_SENDER,
    to: DESTINATION,
    content: {
      text: `${text}\nLokasi: https://maps.google.com/?q=${lat},${lon}`,
    },
  };

  //   await axios.post(`${BASE_URL}/whatsapp/1/message/text`, payload, {
  //     headers: {Authorization: `App ${API_KEY}`},
  //   });

  try {
    const res = await axios.post(
      `${BASE_URL}/whatsapp/1/message/text`,
      payload,
      {headers: {Authorization: `App ${API_KEY}`}},
    );

    console.log('✅ Success:', res.data);
    Alert.alert('✅ Success SOS message sent to rasguard');
  } catch (err: any) {
    console.error('❌ Error:', err.response?.data || err.message);
  }

  // kalau ada foto / audio, pakai endpoint:
  // POST /whatsapp/1/message/media
}
