export async function GET() {
  try {
    const res = await fetch("http://ip-api.com/json/?fields=lat,lon,status");
    const data = await res.json();
    
    if (data.status !== "success") {
      throw new Error("ip-api failed");
    }

    return Response.json({
      latitude: data.lat,
      longitude: data.lon,
    });
  } catch (error) {
    console.error("Geolocation API error:", error);
    return Response.json(
      { error: "Failed to get location" },
      { status: 500 }
    );
  }
}