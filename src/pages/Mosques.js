import { t } from "../context/Preferences";
import { useState } from "react";
import { useRemote } from "../hooks/useRemote";
import { PageHeading, Feedback, Empty } from "../components/community/Shared";
import LocationForm from "../components/LocationForm";
import "./Extended.css";
export default function Mosques() {
  const [location, setLocation] = useState(null);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const remote = useRemote(
    search ? "/mosques/search" : location ? "/mosques/nearby" : null,
    {
      jwt: true,
      params: search
        ? {
            q: search,
          }
        : {
            lat: location?.latitude,
            lng: location?.longitude,
            radius: 5000,
          },
    }
  );
  const mosques = remote.data?.mosques || [];
  const center = selected?.location || mosques[0]?.location || location;
  const lat = center?.latitude,
    lon = center?.longitude;
  const bounds = center
    ? `${lon - 0.025},${Math.max(-90, lat - 0.015)},${lon + 0.025},${Math.min(
        90,
        lat + 0.015
      )}`
    : "";
  return (
    <>
      <PageHeading
        eyebrow={t("YAKININDAKİ HUZUR")}
        title={t("Camiler")}
        description={t("Yakındaki camileri haritada bul veya adına göre ara.")}
      />
      <LocationForm
        onLocation={(value) => {
          setLocation(value);
          setSearch("");
          setSelected(null);
        }}
      />
      <form
        className="pt-actions pt-section-gap"
        onSubmit={(e) => {
          e.preventDefault();
          setSelected(null);
          setSearch(query.trim());
        }}
      >
        <label className="pt-field pt-grow">
          {t("Cami adı")}
          <input
            value={query}
            minLength="2"
            maxLength="100"
            required
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <button className="pt-button">{t("Ara")}</button>
      </form>
      <Feedback error={remote.error} retry={remote.refresh} />
      {remote.loading && <p role="status">{t("Camiler yükleniyor…")}</p>}
      {center && (
        <iframe
          className="pt-mosque-map pt-section-gap"
          title={t("Cami haritası")}
          loading="lazy"
          referrerPolicy="no-referrer"
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(
            bounds
          )}&layer=mapnik&marker=${lat},${lon}`}
        />
      )}
      <div className="pt-extended-grid pt-section-gap">
        {mosques.map((mosque) => (
          <article className="pt-panel" key={mosque._id}>
            <h2>{t(mosque.name)}</h2>
            <p className="pt-note">
              {[mosque.address, mosque.district, mosque.city]
                .filter(Boolean)
                .join(" · ")}
            </p>
            {mosque.distanceText && (
              <p className="pt-note">{t(mosque.distanceText)}</p>
            )}
            <div className="pt-actions">
              <button
                className="pt-button secondary"
                onClick={() => setSelected(mosque)}
                aria-pressed={selected?._id === mosque._id}
              >
                {t("Haritada göster")}
              </button>
              <a
                className="pt-button"
                target="_blank"
                rel="noopener noreferrer"
                href={`https://www.google.com/maps/dir/?api=1&destination=${mosque.location.latitude},${mosque.location.longitude}`}
              >
                {t("Yol tarifi")}
              </a>
            </div>
          </article>
        ))}
      </div>
      {remote.data && !mosques.length && !remote.loading && (
        <Empty>{t("Bu konumda veya aramada cami bulunamadı.")}</Empty>
      )}
    </>
  );
}
