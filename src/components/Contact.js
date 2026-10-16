import { t } from "../context/Preferences";
import React, { useState } from "react";
import PageLayout from "./PageLayout";
function Contact() {
  const [message, setMessage] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Öneri:", message);
    setMessage("");
  };
  return (
    <PageLayout>
      <h2>{t("İletişim")}</h2>
      <p>
        {t(
          "Herhangi bir sorunuz veya öneriniz varsa, bize ulaşmaktan çekinmeyin!"
        )}
      </p>
      <form className="suggestion-form" onSubmit={handleSubmit}>
        <label htmlFor="message">{t("Önerileriniz")}</label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t("Önerilerinizi buraya yazın...")}
        ></textarea>
        <button type="submit">{t("Gönder")}</button>
      </form>
    </PageLayout>
  );
}
export default Contact;
