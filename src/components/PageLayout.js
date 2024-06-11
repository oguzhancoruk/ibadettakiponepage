import React from 'react';


function PageLayout({ children }) {
  return (
    <section className="page-layout">
      <div className="overlay"></div>
      <div className="content">
        {children}
      </div>
    </section>
  );
}

export default PageLayout;
