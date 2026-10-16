import { t } from "../context/Preferences";
import { useState } from "react";
import { getLocation, validCoordinates } from "../utils/location";
import { Feedback } from "./community/Shared";
export default function LocationForm({ onLocation, disabled = false }) {
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <div className="pt-panel pt-section-gap">
      <p className="pt-note">
        {t(
          "Konumun, seçtiğin araç için kullanılır. Yakındaki camileri bulurken koordinatların sunucuya gönderilir."
        )}
      </p>
      <Feedback error={error} />
      <button
        className="pt-button"
        disabled={busy || disabled}
        onClick={async () => {
          setBusy(true);
          setError("");
          try {
            const value = await getLocation();
            setLat(String(value.latitude));
            setLon(String(value.longitude));
            onLocation(value);
          } catch (e) {
            setError(e.message);
          } finally {
            setBusy(false);
          }
        }}
      >
        {t(busy ? "Konum alınıyor…" : "Konumumu kullan")}
      </button>
      <form
        className="pt-actions pt-section-gap"
        onSubmit={(e) => {
          e.preventDefault();
          if (!validCoordinates(lat, lon))
            return setError("Geçerli enlem ve boylam gir.");
          setError("");
          onLocation({
            latitude: Number(lat),
            longitude: Number(lon),
          });
        }}
      >
        <label className="pt-field">
          {t("Enlem")}
          <input
            type="number"
            step="any"
            min="-90"
            max="90"
            required
            value={lat}
            onChange={(e) => setLat(e.target.value)}
          />
        </label>
        <label className="pt-field">
          {t("Boylam")}
          <input
            type="number"
            step="any"
            min="-180"
            max="180"
            required
            value={lon}
            onChange={(e) => setLon(e.target.value)}
          />
        </label>
        <button className="pt-button secondary" disabled={busy || disabled}>
          {t("Koordinatları kullan")}
        </button>
      </form>
    </div>
  );
}
