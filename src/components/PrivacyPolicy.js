import { t } from "../context/Preferences";
import React from "react";
import PageLayout from "./PageLayout";
function PrivacyPolicy() {
  return (
    <PageLayout>
      <h2>{t("Privacy Policy")}</h2>
      <p>{t("Effective date: January 1, 2024")}</p>

      <p>
        {t(
          "Welcome to PrayerTrack. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application."
        )}
      </p>

      <h3>{t("Information We Collect")}</h3>
      <p>
        {t(
          "We may collect information about you in a variety of ways. The information we may collect via the app includes:"
        )}
      </p>
      <ul>
        <li>{t("Personal Data")}</li>
        <li>{t("Derivative Data")}</li>
        <li>{t("Mobile Device Access")}</li>
        <li>{t("Push Notifications")}</li>
      </ul>

      <h3>{t("How We Use Your Information")}</h3>
      <p>
        {t(
          "Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use the information collected via the app to:"
        )}
      </p>
      <ul>
        <li>{t("Create and manage your account")}</li>
        <li>{t("Send you push notifications")}</li>
        <li>{t("Improve our app")}</li>
        <li>{t("Respond to customer service requests")}</li>
      </ul>

      <h3>{t("Disclosure of Your Information")}</h3>
      <p>
        {t(
          "We may share information we have collected about you in certain situations. Your information may be disclosed as follows:"
        )}
      </p>
      <ul>
        <li>{t("By Law or to Protect Rights")}</li>
        <li>{t("Business Transfers")}</li>
        <li>{t("Third-Party Service Providers")}</li>
      </ul>

      <h3>{t("Contact Us")}</h3>
      <p>
        {t(
          "If you have questions or comments about this Privacy Policy, please contact us at:"
        )}
      </p>
      <p>{t("Email: support@prayertrack.com")}</p>
    </PageLayout>
  );
}
export default PrivacyPolicy;
