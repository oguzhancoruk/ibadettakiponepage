export const KAABA_LAT = 21.4225;
export const KAABA_LON = 39.8262;

export const normalizeDegrees = (value) => ((value % 360) + 360) % 360;

export const shortestHeadingDelta = (from, to) =>
  normalizeDegrees(to - from + 180) - 180;

export const calculateQiblaDirection = (userLat, userLon) => {
  const lat1 = (userLat * Math.PI) / 180;
  const lat2 = (KAABA_LAT * Math.PI) / 180;
  const lon1 = (userLon * Math.PI) / 180;
  const lon2 = (KAABA_LON * Math.PI) / 180;
  const longitudeDifference = lon2 - lon1;
  const y = Math.sin(longitudeDifference) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(longitudeDifference);

  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
};

export const calculateDistance = (lat1, lon1) => {
  const earthRadius = 6371;
  const latitudeDifference = ((KAABA_LAT - lat1) * Math.PI) / 180;
  const longitudeDifference = ((KAABA_LON - lon1) * Math.PI) / 180;
  const a =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((KAABA_LAT * Math.PI) / 180) *
      Math.sin(longitudeDifference / 2) ** 2;

  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};
