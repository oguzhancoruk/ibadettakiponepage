import { t } from "../context/Preferences";
import { useState } from "react";
import { useRemote, useMutation } from "../hooks/useRemote";
import { request } from "../services/api";
import { PageHeading, Feedback, Empty } from "../components/community/Shared";
import "./Extended.css";
export default function Support() {
  const [form, setForm] = useState({
    subject: "",
    message: "",
    category: "general",
  });
  const remote = useRemote("/support/tickets/my", {
    jwt: true,
    params: {
      limit: 30,
    },
  });
  const mutation = useMutation();
  const update = (e) =>
    setForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  return (
    <>
      <PageHeading
        eyebrow={t("YANINDAYIZ")}
        title={t("Destek merkezi")}
        description={t(
          "Bir sorun bildir, önerini paylaş ve yanıtları buradan takip et."
        )}
      />
      <Feedback error={mutation.error} message={mutation.message} />
      <form
        className="pt-panel pt-form-stack"
        onSubmit={async (e) => {
          e.preventDefault();
          const result = await mutation.run(
            "send",
            () =>
              request("/support/tickets", {
                method: "post",
                jwt: true,
                data: {
                  ...form,
                  source: "web",
                },
              }),
            "Destek talebin alındı. Yanıtı bu sayfadan takip edebilirsin."
          );
          if (result.ok) {
            setForm({
              subject: "",
              message: "",
              category: "general",
            });
            remote.refresh();
          }
        }}
      >
        <label className="pt-field">
          {t("Kategori")}
          <select name="category" value={form.category} onChange={update}>
            <option value="general">{t("Genel")}</option>
            <option value="technical">{t("Teknik sorun")}</option>
            <option value="subscription">{t("Satın alma")}</option>
            <option value="account">{t("Hesap")}</option>
            <option value="feature">{t("Öneri")}</option>
          </select>
        </label>
        <label className="pt-field">
          {t("Konu")}
          <input
            name="subject"
            required
            maxLength="140"
            value={form.subject}
            onChange={update}
            disabled={Boolean(mutation.busy)}
          />
        </label>
        <label className="pt-field">
          {t("Mesajın")}
          <textarea
            rows="6"
            name="message"
            required
            maxLength="4000"
            value={form.message}
            onChange={update}
            disabled={Boolean(mutation.busy)}
          />
        </label>
        <button className="pt-button" disabled={Boolean(mutation.busy)}>
          {t(mutation.busy ? "Gönderiliyor…" : "Talep gönder")}
        </button>
      </form>
      <h2 className="pt-section-gap">{t("Taleplerim")}</h2>
      <Feedback error={remote.error} retry={remote.refresh} />
      {t(
        remote.loading ? (
          <p role="status">{t("Talepler yükleniyor…")}</p>
        ) : remote.data?.length ? (
          <div className="pt-form-stack pt-section-gap">
            {remote.data.map((ticket) => (
              <article className="pt-panel" key={ticket.ticketId}>
                <span className="pt-tag">{t(ticket.statusLabel)}</span>
                <h3>{t(ticket.subject)}</h3>
                <p className="pt-note pt-pre-line">{ticket.message}</p>
                {ticket.adminReply && (
                  <blockquote className="pt-support-reply">
                    <strong>{t("Destek ekibinin yanıtı")}</strong>
                    <p className="pt-pre-line">{ticket.adminReply}</p>
                  </blockquote>
                )}
              </article>
            ))}
          </div>
        ) : (
          !remote.error && <Empty>{t("Henüz bir destek talebin yok.")}</Empty>
        )
      )}
    </>
  );
}
