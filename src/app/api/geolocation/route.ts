const FALLBACK = { latitude: -23.5505, longitude: -46.6333 };

async function fetchWithTimeout(url: string, timeoutMs: number) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
}

export async function GET() {
  // Tenta ip-api.com (HTTP, mais rápido)
  try {
    const res = await fetchWithTimeout(
      "http://ip-api.com/json/?fields=lat,lon,status",
      3000
    );
    const data = await res.json();
    if (data.status === "success") {
      return Response.json({ latitude: data.lat, longitude: data.lon });
    }
  } catch {
    // ignora, tenta próximo
  }

  // Fallback: ipapi.co (HTTPS)
  try {
    const res = await fetchWithTimeout("https://ipapi.co/json/", 3000);
    const data = await res.json();
    if (data.latitude && data.longitude) {
      return Response.json({ latitude: data.latitude, longitude: data.longitude });
    }
  } catch {
    // ignora, usa fallback fixo
  }

  // Fallback final: São Paulo
  return Response.json(FALLBACK);
}