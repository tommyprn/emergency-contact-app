import {useCallback} from 'react';
import {openWhatsApp} from '../utils/whatsapp';

export function useWhatsAppLink(phoneE164: string) {
  const open = useCallback(
    (text: string) => openWhatsApp({phoneE164, text}),
    [phoneE164],
  );
  return {open};
}
