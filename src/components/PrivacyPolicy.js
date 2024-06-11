import React from 'react';
import PageLayout from './PageLayout';

function PrivacyPolicy() {
  return (
    <PageLayout>
      <h2>Privacy Policy</h2>
      <p>Effective date: January 1, 2024</p>
      
      <p>
        Welcome to PrayerTrack. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.
      </p>

      <h3>Information We Collect</h3>
      <p>
        We may collect information about you in a variety of ways. The information we may collect via the app includes:
      </p>
      <ul>
        <li>Personal Data</li>
        <li>Derivative Data</li>
        <li>Mobile Device Access</li>
        <li>Push Notifications</li>
      </ul>

      <h3>How We Use Your Information</h3>
      <p>
        Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use the information collected via the app to:
      </p>
      <ul>
        <li>Create and manage your account</li>
        <li>Send you push notifications</li>
        <li>Improve our app</li>
        <li>Respond to customer service requests</li>
      </ul>

      <h3>Disclosure of Your Information</h3>
      <p>
        We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
      </p>
      <ul>
        <li>By Law or to Protect Rights</li>
        <li>Business Transfers</li>
        <li>Third-Party Service Providers</li>
      </ul>

      <h3>Contact Us</h3>
      <p>
        If you have questions or comments about this Privacy Policy, please contact us at:
      </p>
      <p>Email: support@prayertrack.com</p>
    </PageLayout>
  );
}

export default PrivacyPolicy;
