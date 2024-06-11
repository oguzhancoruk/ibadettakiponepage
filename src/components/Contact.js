import React, { useState } from 'react';
import PageLayout from './PageLayout';

function Contact() {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Öneri:', message);
    setMessage('');
  };

  return (
    <PageLayout>
      <h2>İletişim</h2>
      <p>Herhangi bir sorunuz veya öneriniz varsa, bize ulaşmaktan çekinmeyin!</p>
      <form className="suggestion-form" onSubmit={handleSubmit}>
        <label htmlFor="message">Önerileriniz</label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Önerilerinizi buraya yazın..."
        ></textarea>
        <button type="submit">Gönder</button>
      </form>
    </PageLayout>
  );
}

export default Contact;
