import { t } from "../context/Preferences";
import { useEffect, useState } from "react";
import { PageHeading, Feedback } from "../components/community/Shared";
import LocationForm from "../components/LocationForm";
import { calculateQiblaDirection, calculateDistance } from "../utils/qibla";
import "./Extended.css";
export default function Qibla() {
  const [location, setLocation] = useState(null);
  const [heading, setHeading] = useState(null);
  const [enabled, setEnabled] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!enabled) return;
    const orient = (event) => {
      const value = Number.isFinite(event.webkitCompassHeading)
        ? event.webkitCompassHeading
        : event.absolute === true && Number.isFinite(event.alpha)
        ? (360 - event.alpha) % 360
        : null;
      if (value !== null) {
        setHeading(value);
        setError("");
      }
    };
    window.addEventListener("deviceorientationabsolute", orient);
    window.addEventListener("deviceorientation", orient);
    const timeout = setTimeout(
      () =>
        setHeading((current) => {
          if (current === null)
            setError(
              "Pusula verisi alınamadı. Aşağıdaki açıyı kuzeye göre kullanabilirsin."
            );
          return current;
        }),
      8000
    );
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("deviceorientationabsolute", orient);
      window.removeEventListener("deviceorientation", orient);
    };
  }, [enabled]);
  const bearing = location
    ? calculateQiblaDirection(location.latitude, location.longitude)
    : null;
  return (
    <>
      <PageHeading
        eyebrow={t("YÖNÜNÜ BUL")}
        title={t("Kıble pusulası")}
        description={t(
          "Konumundan Kâbe yönünü bul. Açılar kuzeyden saat yönünde ölçülür."
        )}
      />
      <LocationForm onLocation={setLocation} />
      <Feedback error={error} />
      {location && (
        <section className="pt-panel pt-qibla-panel">
          <div className="pt-compass">
            <span className="pt-compass-north">{t("N")}</span>
            <span className="pt-compass-east">{t("E")}</span>
            <span className="pt-compass-south">{t("S")}</span>
            <span className="pt-compass-west">{t("W")}</span>
            <div
              className="pt-compass-needle"
              style={{
                transform: `rotate(${bearing - (heading ?? 0)}deg)`,
              }}
            >
              <span>▲</span>
            </div>
            <span className="pt-compass-center">▣</span>
          </div>
          <h2>{bearing.toFixed(1)}°</h2>
          <p className="pt-note">
            {Math.round(
              calculateDistance(location.latitude, location.longitude)
            ).toLocaleString()}
            {t(" km · Kâbe")}
          </p>
          <p className="pt-note">
            {t(
              heading === null
                ? "Kuzeyi üstte tutarak kıble açısını takip et."
                : "Telefonunu düz tut ve oku takip et. Manyetik sapma ölçümü etkileyebilir."
            )}
          </p>
          <button
            className="pt-button secondary"
            disabled={enabled}
            onClick={async () => {
              setError("");
              try {
                if (!window.DeviceOrientationEvent)
                  throw new Error("Bu cihazda pusula sensörü yok.");
                if (
                  typeof window.DeviceOrientationEvent.requestPermission ===
                    "function" &&
                  (await window.DeviceOrientationEvent.requestPermission()) !==
                    "granted"
                )
                  throw new Error("Pusula izni verilmedi.");
                setEnabled(true);
              } catch (e) {
                setError(e.message);
              }
            }}
          >
            {t(enabled ? "Pusula sensörü açık" : "Pusula sensörünü aç")}
          </button>
        </section>
      )}
    </>
  );
}
