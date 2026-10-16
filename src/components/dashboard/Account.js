import { t } from "../../context/Preferences";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { FiUser, FiLogOut } from "react-icons/fi";
import { getSession, clearSession } from "../../utils/session";
import { request } from "../../services/api";
import { useMutation } from "../../hooks/useRemote";
import { Feedback } from "../community/Shared";
import "../../pages/Extended.css";
export default function Account() {
  const user = getSession();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [deleting, setDeleting] = useState(false);
  const mutation = useMutation();
  if (!user) return <Navigate to="/login" replace />;
  return (
    <>
      <div className="pt-page-heading">
        <div>
          <p className="pt-eyebrow">{t("SANA AİT BİR ALAN")}</p>
          <h1>{t("Hesabım")}</h1>
          <p>{t("Profil bilgilerin ve hesap işlemlerin.")}</p>
        </div>
      </div>
      <section className="pt-panel">
        <span className="pt-tool-icon">
          <FiUser />
        </span>
        <h2>{t(user.name || user.username || "Kullanıcı")}</h2>
        <p className="pt-note">{user.email}</p>
        <p className="pt-note">
          {t(
            "Web ve mobil uygulamada aynı hesabınla giriş yaparak ibadet kayıtlarına ulaşabilirsin."
          )}
        </p>
        <div className="pt-actions">
          <Link className="pt-button secondary" to="/settings">
            {t("Uygulama ayarları")}
          </Link>
          <Link className="pt-button secondary" to="/subscription">
            {t("Satın alma durumum")}
          </Link>
          <Link className="pt-button secondary" to="/support">
            {t("Destek merkezi")}
          </Link>
          <button
            className="pt-button secondary"
            onClick={async () => {
              await clearSession();
              navigate("/login", {
                replace: true,
              });
            }}
          >
            <FiLogOut />
            {t(" Çıkış yap")}
          </button>
        </div>
      </section>
      <section className="pt-account-request">
        <h3>{t("Hesabımı sil")}</h3>
        <p>
          {t(
            "Hesabın, namaz ve oruç kayıtların, günlüğün, hedeflerin ve kişisel verilerin kalıcı olarak silinir. Bu işlem geri alınamaz. Mağaza aboneliğin varsa önce satın aldığın mağazadan yönetebilirsin."
          )}
        </p>
        <Feedback error={mutation.error} />
        {t(
          !deleting ? (
            <button
              className="pt-button secondary"
              onClick={() => setDeleting(true)}
            >
              {t("Hesap silme adımını aç")}
            </button>
          ) : (
            <form
              className="pt-form-stack"
              onSubmit={async (e) => {
                e.preventDefault();
                if (confirmation !== "SİL") return;
                const result = await mutation.run("delete", () =>
                  request("/account", {
                    method: "delete",
                    jwt: true,
                    data: {
                      password,
                      confirmation: "DELETE",
                    },
                  })
                );
                if (result.ok) {
                  const prefix = `pt:${user._id}:`;
                  Object.keys(localStorage)
                    .filter((key) => key.startsWith(prefix))
                    .forEach((key) => localStorage.removeItem(key));
                  await clearSession();
                  navigate("/login", {
                    replace: true,
                    state: {
                      accountDeleted: true,
                    },
                  });
                }
              }}
            >
              <label className="pt-field">
                {t("Mevcut şifren")}
                <input
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={Boolean(mutation.busy)}
                />
              </label>
              <label className="pt-field">
                {t("Onaylamak için SİL yaz")}
                <input
                  value={confirmation}
                  onChange={(e) => setConfirmation(e.target.value)}
                  autoComplete="off"
                  disabled={Boolean(mutation.busy)}
                />
              </label>
              <div className="pt-actions">
                <button
                  className="pt-button pt-danger-button"
                  disabled={
                    !password ||
                    confirmation !== "SİL" ||
                    Boolean(mutation.busy)
                  }
                >
                  {t(
                    mutation.busy
                      ? "Hesabın siliniyor…"
                      : "Hesabımı kalıcı olarak sil"
                  )}
                </button>
                <button
                  className="pt-button secondary"
                  type="button"
                  disabled={Boolean(mutation.busy)}
                  onClick={() => {
                    setDeleting(false);
                    setPassword("");
                    setConfirmation("");
                  }}
                >
                  {t("Vazgeç")}
                </button>
              </div>
            </form>
          )
        )}
      </section>
    </>
  );
}
