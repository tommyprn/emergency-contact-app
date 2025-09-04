// Dipanggil dari dalam task BackgroundActions jika kamu mau push ke server.
export async function pushLocationSample(sample: {
  lat: number;
  lon: number;
  ts: number;
}) {
  try {
    await fetch('https://api.rasguard.yourdomain/ingest/location', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(sample),
    });
  } catch (e) {
    /* swallow/log */
  }
}
