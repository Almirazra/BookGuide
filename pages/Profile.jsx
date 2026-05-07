import "./Profile.css";

function Profile() {
  return (
    <div className="profile-page container py-5">
      <section className="profile-header">
        <h1>Profil Saya</h1>
        <p>
          Halo! Saya adalah pengembang di balik BookGuide. Saya suka membuat aplikasi
          web yang menarik, mudah digunakan, dan membantu orang menemukan buku terbaik.
        </p>
      </section>

      <section className="profile-card">
        <div className="profile-photo-wrapper">
          <img
            className="profile-photo"
            src="/foto.jpg"
            alt="Foto profil"
          />
        </div>
        <div className="profile-info">
          <h2>Nama Saya</h2>
          <p className="profile-role">Pengembang Web</p>
          <p>
            Saya fokus pada pembuatan antarmuka yang bersih dan responsif, serta
            pengalaman pengguna yang nyaman.
          </p>
        </div>
      </section>

      <section className="profile-details">
        <h3>Tentang Saya</h3>
        <ul>
          <li>Penguasaan React, Vite, dan pengembangan frontend modern</li>
          <li>Mengutamakan pengalaman pengguna dan desain responsif</li>
          <li>Suka mengelola data buku dan membuat fitur admin yang mudah digunakan</li>
          <li>Bersemangat membangun website yang membantu pencarian buku</li>
        </ul>
      </section>
    </div>
  );
}

export default Profile;
