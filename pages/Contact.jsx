import "./Contact.css";

function Contact() {
  return (
    <div className="contact-page">
      <h1 className="contact-title">Kontak</h1>

      <div className="contact-card">

        {/* Email */}
        <div className="contact-item">
          <span className="contact-item__icon">📧</span>
          <div>
            <p className="contact-item__label">Email</p>
            <p className="contact-item__value">admin@bookrec.com</p>
          </div>
        </div>

        {/* WhatsApp */}
        <div className="contact-item">
          <span className="contact-item__icon">📱</span>
          <div>
            <p className="contact-item__label">WhatsApp</p>
            <p className="contact-item__value">081234567890</p>
          </div>
        </div>

        {/* Instagram */}
        <div className="contact-item">
          <span className="contact-item__icon">📸</span>
          <div>
            <p className="contact-item__label">Instagram</p>
            <p className="contact-item__value">@bookrec</p>
          </div>
        </div>

        {/* Alamat */}
        <div className="contact-item">
          <span className="contact-item__icon">📍</span>
          <div>
            <p className="contact-item__label">Alamat</p>
            <p className="contact-item__value">Indonesia</p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Contact;