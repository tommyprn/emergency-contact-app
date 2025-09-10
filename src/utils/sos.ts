// src/utils/sos.ts
export type SosRequest = {
  photoUrl?: string;
  location?: {lat: number; lon: number};
  userPhoneE164: string; // contoh: "62812xxxxxxx" (tanpa +)
};

const BASE_URL = 'http://10.20.30.74:4000'; // ganti ke domain/server kamu

export async function requestWACall(payload: SosRequest) {
  try {
    const res = await fetch(`${BASE_URL}/api/sos/call`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      // coba baca JSON dulu
      let errorBody: unknown = null;
      try {
        errorBody = await res.json();
      } catch {
        errorBody = await res.text().catch(() => '');
      }

      const error = new Error(
        `HTTP ${res.status} ${res.statusText} → ${JSON.stringify(errorBody)}`,
      );
      (error as any).status = res.status;
      (error as any).body = errorBody;
      throw error;
    }

    return (await res.json()) as {status: string; messageId?: string};
  } catch (e) {
    // lebih detail log error
    if (e instanceof Error) {
      console.error(
        '[requestWACall] Failed:',
        e.message,
        '\nStack:',
        e.stack,
        '\nPayload:',
        payload,
      );
    } else {
      console.error('[requestWACall] Unknown error:', e);
    }
    throw e; // biar caller bisa handle juga
  }
}
