import { t } from "../context/Preferences";
import React from "react";
function PageLayout({ children }) {
  return (
    <section className="page-layout">
      <div className="overlay"></div>
      <div className="content">{t(children)}</div>
    </section>
  );
}
export default PageLayout;
