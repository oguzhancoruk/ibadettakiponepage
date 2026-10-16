export function getLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation)
      return reject(new Error("Tarayıcın konumu desteklemiyor."));
    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      (error) =>
        reject(
          new Error(
            error.code === 1
              ? "Konum izni verilmedi. Tarayıcı ayarlarından izin verebilir veya koordinat girebilirsin."
              : "Konum alınamadı. Koordinat girerek devam edebilirsin."
          )
        ),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 300000 }
    );
  });
}
export const validCoordinates = (lat, lon) =>
  String(lat).trim() !== "" &&
  String(lon).trim() !== "" &&
  Number.isFinite(Number(lat)) &&
  Math.abs(Number(lat)) <= 90 &&
  Number.isFinite(Number(lon)) &&
  Math.abs(Number(lon)) <= 180;
