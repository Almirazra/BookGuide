import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import initialBooks from "../../data/book";
import Footer from "../../components/Footer";
import "./AdminDashboard.css";

const DATA_VERSION = "v2";

const DEFAULT_CATEGORIES = [
  ...new Set(initialBooks.map((b) => b.category).filter(Boolean)),
];

function AdminDashboard() {
  const navigate = useNavigate();

  const [books, setBooks] = useState(() => {
    const savedVersion = localStorage.getItem("booksVersion");
    if (savedVersion !== DATA_VERSION) {
      localStorage.setItem("books", JSON.stringify(initialBooks));
      localStorage.setItem("booksVersion", DATA_VERSION);
      return initialBooks;
    }
    const saved = localStorage.getItem("books");
    return saved ? JSON.parse(saved) : initialBooks;
  });

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem("categories");
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  // ── Log Aktivitas ────────────────────────────────────────────────────────────
  const [activityLog, setActivityLog] = useState(() => {
    const saved = localStorage.getItem("activityLog");
    return saved ? JSON.parse(saved) : [];
  });

  const addLog = (type, message) => {
    const now = new Date();
    const timeStr = now.toLocaleString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      day: "numeric",
      month: "short",
    });
    const entry = {
      id: Date.now(),
      type, // "add" | "edit" | "delete" | "category"
      message,
      time: timeStr,
    };
    setActivityLog((prev) => [entry, ...prev].slice(0, 30));
  };

  // Active Section
  const [activeSection, setActiveSection] = useState("dashboard");

  // Form Buku
  const [isEdit, setIsEdit] = useState(false);
  const [newBook, setNewBook] = useState({
    id: null, title: "", author: "", category: "", rating: "", year: "", cover: "", synopsis: "",
  });
  const [bookError, setBookError] = useState("");

  // Form Kategori
  const [newCategoryInput, setNewCategoryInput] = useState("");
  const [categoryError, setCategoryError] = useState("");

  // Search and filter
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [profile, setProfile] = useState(() => {
    const savedProfile = localStorage.getItem("adminProfile");
    return savedProfile
      ? JSON.parse(savedProfile)
      : {
        name: "Admin BookGuide",
        role: "Pengelola Koleksi Buku",
        status: "Aktif",
        joined: "2024",
      };
  });
  const [profileDraft, setProfileDraft] = useState(profile);
  const [editingProfile, setEditingProfile] = useState(false);

  useEffect(() => {
    localStorage.setItem("books", JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem("activityLog", JSON.stringify(activityLog));
  }, [activityLog]);

  useEffect(() => {
    localStorage.setItem("adminProfile", JSON.stringify(profile));
  }, [profile]);

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/");
  };

  const handleResetData = () => {
    if (
      window.confirm(
        "Reset semua data ke data awal? Perubahan yang sudah dibuat akan hilang."
      )
    ) {
      localStorage.removeItem("books");
      localStorage.removeItem("booksVersion");
      localStorage.removeItem("categories");
      localStorage.removeItem("activityLog");
      setBooks(initialBooks);
      setCategories(DEFAULT_CATEGORIES);
      setActivityLog([]);
    }
  };

  // ── Manajemen Kategori ────────────────────────────────────────────────────────

  const handleAddCategory = () => {
    const trimmed = newCategoryInput.trim();
    if (!trimmed) {
      setCategoryError("Nama kategori tidak boleh kosong.");
      return;
    }
    if (categories.map((c) => c.toLowerCase()).includes(trimmed.toLowerCase())) {
      setCategoryError("Kategori sudah ada.");
      return;
    }
    setCategories((prev) => [...prev, trimmed]);
    addLog("category", `Kategori "${trimmed}" ditambahkan`);
    setNewCategoryInput("");
    setCategoryError("");
  };

  const handleDeleteCategory = (cat) => {
    const usedByBooks = books.some((b) => b.category === cat);
    if (usedByBooks) {
      if (
        !window.confirm(
          `Kategori "${cat}" masih digunakan oleh beberapa buku. Tetap hapus? Buku-buku tersebut akan kehilangan kategorinya.`
        )
      )
        return;
      setBooks((prev) =>
        prev.map((b) => (b.category === cat ? { ...b, category: "" } : b))
      );
    }
    setCategories((prev) => prev.filter((c) => c !== cat));
    addLog("category", `Kategori "${cat}" dihapus`);
    if (categoryFilter === cat) setCategoryFilter("All");
  };

  // ── Buku ─────────────────────────────────────────────────────────────────────

  const filteredBooks = books.filter((book) => {
    const matchSearch =
      book.title?.toLowerCase().includes(search.toLowerCase()) ||
      book.author?.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      categoryFilter === "All" || book.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const normalizedTitle = newBook.title.trim().toLowerCase();
    const normalizedAuthor = newBook.author.trim().toLowerCase();
    const duplicateBook = books.some(
      (b) =>
        b.id !== newBook.id &&
        b.title?.trim().toLowerCase() === normalizedTitle &&
        b.author?.trim().toLowerCase() === normalizedAuthor
    );

    if (duplicateBook) {
      setBookError("Buku ini sudah ada. Silakan cek judul dan penulis.");
      return;
    }

    if (isEdit) {
      setBooks((prev) => prev.map((b) => (b.id === newBook.id ? newBook : b)));
      addLog("edit", `Buku "${newBook.title}" diperbarui`);
    } else {
      const bookWithId = { ...newBook, id: Date.now() };
      setBooks((prev) => [...prev, bookWithId]);
      addLog("add", `Buku "${newBook.title}" ditambahkan`);
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    const book = books.find((b) => b.id === id);
    if (window.confirm("Yakin ingin menghapus buku ini?")) {
      setBooks((prev) => prev.filter((b) => b.id !== id));
      if (book) addLog("delete", `Buku "${book.title}" dihapus`);
    }
  };

  const handleCloseModal = () => {
    setIsEdit(false);
    setBookError("");
    setNewBook({
      id: null, title: "", author: "", category: "", rating: "", year: "", cover: "", synopsis: "",
    });
  };

  const handleOpenProfileEdit = () => {
    setProfileDraft(profile);
    setEditingProfile(true);
  };

  const handleCancelProfileEdit = () => {
    setProfileDraft(profile);
    setEditingProfile(false);
  };

  const handleSaveProfile = () => {
    if (!profileDraft.name.trim()) return;
    setProfile({ ...profileDraft, name: profileDraft.name.trim() });
    addLog("edit", `Profil admin diperbarui`);
    setEditingProfile(false);
  };

  // ── Stats ─────────────────────────────────────────────────────────────────────

  const totalBooks = books.length;
  const totalRekomendasi = books.filter((b) => parseFloat(b.rating || 0) >= 4).length;
  const totalKategori = categories.length;
  const avgRating = books.length
    ? (
      books.reduce((sum, b) => sum + parseFloat(b.rating || 0), 0) /
      books.length
    ).toFixed(1)
    : "0.0";

  // Statistik tambahan berdasarkan data buku aktual
  const totalAuthors = new Set(books.map(b => b.author?.trim()).filter(Boolean)).size;
  const booksByYear = books.reduce((acc, book) => {
    const year = book.year || 'Unknown';
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {});
  const mostProductiveYear = Object.keys(booksByYear).length > 0
    ? Object.keys(booksByYear).reduce((a, b) =>
      booksByYear[a] > booksByYear[b] ? a : b
    )
    : 'N/A';

  // 5 buku terbaru (berdasarkan id = timestamp)
  const recentBooks = [...books]
    .sort((a, b) => (b.id || 0) - (a.id || 0))
    .slice(0, 5);

  // Label ikon log
  const logConfig = {
    add: { icon: "➕", label: "Tambah", cls: "log-dot-add" },
    edit: { icon: "✏️", label: "Edit", cls: "log-dot-edit" },
    delete: { icon: "🗑️", label: "Hapus", cls: "log-dot-del" },
    category: { icon: "🏷️", label: "Kategori", cls: "log-dot-cat" },
  };

  return (
    <div>
      <div className="admin-page">
        {/* TOP NAVBAR */}
        <div className="admin-topbar">
          <div className="admin-topbar-left">
            <span className="admin-logo-text">BOOKGUIDE</span>
            <span className="admin-status-badge">Admin Panel</span>
          </div>
          <div className="admin-topbar-right">
            <span className="admin-user-info">👤 {profile.name}</span>
            <Link to="/">Home</Link>
            <Link to="/rekomendasi">Rekomendasi</Link>
            <Link to="/kategori">Kategori</Link>
            <Link to="/kontak">Kontak</Link>
          </div>
        </div>

        {/* LAYOUT: SIDEBAR + CONTENT */}
        <div className="admin-layout">
          {/* SIDEBAR */}
          <div className="admin-sidebar">
            <div className="sidebar-header">
              <h2>Admin Menu</h2>
            </div>

            <nav className="sidebar-nav">
              <button
                className={`sidebar-item ${activeSection === "dashboard" ? "active" : ""}`}
                onClick={() => setActiveSection("dashboard")}
              >
                📊 Dashboard
              </button>
              <button
                className={`sidebar-item ${activeSection === "add-book" ? "active" : ""}`}
                onClick={() => {
                  setActiveSection("add-book");
                  handleCloseModal();
                }}
              >
                ➕ Tambah Buku
              </button>
              <button
                className={`sidebar-item ${activeSection === "manage-category" ? "active" : ""}`}
                onClick={() => setActiveSection("manage-category")}
              >
                🗂️ Kelola Kategori
              </button>
              <button
                className={`sidebar-item ${activeSection === "list-books" ? "active" : ""}`}
                onClick={() => setActiveSection("list-books")}
              >
                📚 Daftar Buku
              </button>
              <button
                className={`sidebar-item ${activeSection === "profile" ? "active" : ""}`}
                onClick={() => setActiveSection("profile")}
              >
                👤 Profile
              </button>
            </nav>

            <div className="sidebar-footer">
              <button className="btn-reset-sidebar" onClick={handleResetData}>
                Reset Data
              </button>
              <button className="btn-logout-sidebar" onClick={handleLogout}>
                Keluar
              </button>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="admin-main">

            {/* ── DASHBOARD SECTION ── */}
            {activeSection === "dashboard" && (
              <div className="content-section">
                <div className="section-header">
                  <h1>Dashboard</h1>
                  <p>Ringkasan statistik BookGuide</p>
                </div>

                {/* Admin Profile Card */}
                <div className="admin-profile-card">
                  <div className="profile-avatar">
                    <span>{profile.name
                      .split(" ")
                      .map((word) => word[0])
                      .join("")}</span>
                  </div>
                  <div className="profile-content">
                    <h2>{profile.name}</h2>
                    <p className="profile-subtitle">{profile.role}</p>
                    <div className="profile-meta">
                      <span className="meta-item">
                        <strong>Status:</strong> {profile.status}
                      </span>
                      <span className="meta-item">
                        <strong>Bergabung:</strong> {profile.joined}
                      </span>
                    </div>
                  </div>
                  <button className="btn-profile-edit" onClick={handleOpenProfileEdit}>
                    Edit Profil
                  </button>
                </div>

                {editingProfile && (
                  <div className="profile-edit-panel">
                    <div className="profile-edit-heading">
                      <h3>Ubah Profil Admin</h3>
                      <p>Perbarui nama, peran, status, atau tahun bergabung.</p>
                    </div>
                    <form
                      className="form-book profile-edit-form"
                      onSubmit={(e) => { e.preventDefault(); handleSaveProfile(); }}
                    >
                      <div className="form-group">
                        <label>Nama Admin</label>
                        <input className="form-input" type="text" value={profileDraft.name}
                          onChange={(e) => setProfileDraft({ ...profileDraft, name: e.target.value })} />
                      </div>
                      <div className="form-group">
                        <label>Peran</label>
                        <input className="form-input" type="text" value={profileDraft.role}
                          onChange={(e) => setProfileDraft({ ...profileDraft, role: e.target.value })} />
                      </div>
                      <div className="form-group">
                        <label>Status</label>
                        <input className="form-input" type="text" value={profileDraft.status}
                          onChange={(e) => setProfileDraft({ ...profileDraft, status: e.target.value })} />
                      </div>
                      <div className="form-group">
                        <label>Bergabung</label>
                        <input className="form-input" type="text" value={profileDraft.joined}
                          onChange={(e) => setProfileDraft({ ...profileDraft, joined: e.target.value })} />
                      </div>
                      <div className="form-actions">
                        <button type="button" className="btn-form-cancel" onClick={handleCancelProfileEdit}>Batal</button>
                        <button type="submit" className="btn-form-submit">Simpan Profil</button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Statistik */}
                <div className="dashboard-section-title">Statistik Koleksi</div>
                <div className="admin-stats">
                  <div className="stat-card">
                    <span className="stat-label">Total Buku</span>
                    <span className="stat-num">{totalBooks}</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-label">Rekomendasi</span>
                    <span className="stat-num">{totalRekomendasi}</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-label">Kategori</span>
                    <span className="stat-num">{totalKategori}</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-label">Rata-rata Rating</span>
                    <span className="stat-num">{avgRating}</span>
                  </div>
                </div>

                {/* Info Tambahan */}
                <div className="dashboard-section-title">Info Real-Time</div>
                <div className="quick-info-grid">
                  <div className="info-card">
                    <span className="info-icon">🕐</span>
                    <div className="info-content">
                      <span className="info-label">Buku Terakhir Ditambah</span>
                      <span className="info-value">
                        {recentBooks.length > 0
                          ? recentBooks[0].title
                          : "Belum ada"}
                      </span>
                    </div>
                  </div>
                  <div className="info-card">
                    <span className="info-icon">📈</span>
                    <div className="info-content">
                      <span className="info-label">Total Aktivitas Hari Ini</span>
                      <span className="info-value">
                        {activityLog.filter(log => {
                          const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
                          return log.time.includes(today);
                        }).length} Aktivitas
                      </span>
                    </div>
                  </div>
                  <div className="info-card">
                    <span className="info-icon">⭐</span>
                    <div className="info-content">
                      <span className="info-label">Buku Rating Tinggi</span>
                      <span className="info-value">
                        {books.filter(b => parseFloat(b.rating || 0) >= 4.5).length} Buku (≥4.5)
                      </span>
                    </div>
                  </div>
                  <div className="info-card">
                    <span className="info-icon">📚</span>
                    <div className="info-content">
                      <span className="info-label">Kategori Terpopuler</span>
                      <span className="info-value">
                        {categories.length > 0
                          ? (() => {
                            const categoryCounts = categories.map(cat => ({
                              name: cat,
                              count: books.filter(b => b.category === cat).length
                            }));
                            const popular = categoryCounts.reduce((max, cat) =>
                              cat.count > max.count ? cat : max, categoryCounts[0] || { name: "Belum ada", count: 0 }
                            );
                            return `${popular.name} (${popular.count})`;
                          })()
                          : "Belum ada"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Buku Terbaru & Log Aktivitas — 2 kolom */}
                <div className="dashboard-section-title">Buku Terbaru &amp; Aktivitas</div>
                <div className="dashboard-two-col">

                  {/* Tabel Buku Terbaru */}
                  <div className="dash-panel">
                    <div className="dash-panel-header">
                      <span className="dash-panel-icon">🕐</span>
                      <h3>Buku Terbaru Ditambahkan</h3>
                    </div>
                    {recentBooks.length === 0 ? (
                      <p className="empty-state">Belum ada buku.</p>
                    ) : (
                      <table className="recent-table">
                        <thead>
                          <tr>
                            <th>Judul &amp; Penulis</th>
                            <th>Kategori</th>
                            <th>Rating</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentBooks.map((book) => (
                            <tr key={book.id}>
                              <td>
                                <div className="recent-book-title">{book.title}</div>
                                <div className="recent-book-author">{book.author}</div>
                              </td>
                              <td>
                                <span className="badge-category">
                                  {book.category || "-"}
                                </span>
                              </td>
                              <td>
                                <span className="recent-rating">
                                  ⭐ {book.rating || "-"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                    <button
                      className="dash-panel-link"
                      onClick={() => setActiveSection("list-books")}
                    >
                      Lihat semua buku →
                    </button>
                  </div>

                  {/* Log Aktivitas */}
                  <div className="dash-panel">
                    <div className="dash-panel-header">
                      <span className="dash-panel-icon">📋</span>
                      <h3>Log Aktivitas</h3>
                      {activityLog.length > 0 && (
                        <button
                          className="btn-clear-all-logs"
                          onClick={() => {
                            if (window.confirm("Hapus semua log aktivitas?")) {
                              setActivityLog([]);
                            }
                          }}
                          title="Hapus semua aktivitas"
                        >
                          🗑️ Hapus Semua
                        </button>
                      )}
                    </div>
                    {activityLog.length === 0 ? (
                      <p className="empty-state">Belum ada aktivitas tercatat.</p>
                    ) : (
                      <ul className="activity-log-list">
                        {activityLog.slice(0, 8).map((entry) => {
                          const cfg = logConfig[entry.type] || logConfig.edit;
                          return (
                            <li key={entry.id} className="activity-log-item">
                              <span className={`log-dot ${cfg.cls}`}></span>
                              <div className="log-body">
                                <span className="log-message">{entry.message}</span>
                                <span className="log-time">{entry.time}</span>
                              </div>
                              <button
                                className="btn-delete-log"
                                onClick={() => {
                                  setActivityLog(prev => prev.filter(log => log.id !== entry.id));
                                }}
                                title="Hapus aktivitas ini"
                              >
                                ✕
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                    {activityLog.length > 8 && (
                      <p className="log-more">+{activityLog.length - 8} aktivitas lainnya</p>
                    )}
                  </div>
                </div>

                {/* Panduan Cepat */}
                <div className="action-guide">
                  <h3>📋 Panduan Cepat</h3>
                  <div className="guide-items">
                    <div className="guide-item">
                      <span className="guide-icon">1</span>
                      <div className="guide-text">
                        <strong>Tambah Buku Baru</strong>
                        <p>Klik menu "Tambah Buku" untuk menambahkan buku ke koleksi</p>
                      </div>
                    </div>
                    <div className="guide-item">
                      <span className="guide-icon">2</span>
                      <div className="guide-text">
                        <strong>Kelola Kategori</strong>
                        <p>Kelola kategori buku melalui menu "Kelola Kategori"</p>
                      </div>
                    </div>
                    <div className="guide-item">
                      <span className="guide-icon">3</span>
                      <div className="guide-text">
                        <strong>Lihat Daftar Buku</strong>
                        <p>Cek semua buku di menu "Daftar Buku" dengan fitur search dan filter</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── ADD BOOK SECTION ── */}
            {activeSection === "add-book" && (
              <div className="content-section">
                <div className="section-header">
                  <h1>{isEdit ? "Edit Buku" : "Tambah Buku Baru"}</h1>
                  <p>{isEdit ? "Ubah informasi buku" : "Tambahkan buku ke koleksi BookGuide"}</p>
                </div>

                <form onSubmit={handleSubmit} className="form-book">
                  <div className="form-group">
                    <label>Judul Buku</label>
                    <input required type="text" value={newBook.title}
                      onChange={(e) => { setNewBook({ ...newBook, title: e.target.value }); setBookError(""); }}
                      placeholder="Masukkan judul buku" className="form-input" />
                  </div>

                  <div className="form-group">
                    <label>Penulis</label>
                    <input required type="text" value={newBook.author}
                      onChange={(e) => { setNewBook({ ...newBook, author: e.target.value }); setBookError(""); }}
                      placeholder="Nama penulis" className="form-input" />
                  </div>

                  <div className="form-group">
                    <label>Kategori</label>
                    <select required value={newBook.category}
                      onChange={(e) => { setNewBook({ ...newBook, category: e.target.value }); setBookError(""); }}
                      className="form-input">
                      <option value="">-- Pilih Kategori --</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Rating (0–5)</label>
                      <input required type="number" min="0" max="5" step="0.1" value={newBook.rating}
                        onChange={(e) => setNewBook({ ...newBook, rating: e.target.value })}
                        placeholder="0.0" className="form-input" />
                    </div>
                    <div className="form-group">
                      <label>Tahun Terbit</label>
                      <input required type="number" value={newBook.year}
                        onChange={(e) => setNewBook({ ...newBook, year: e.target.value })}
                        placeholder="2023" className="form-input" />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Cover URL</label>
                    <input type="text" value={newBook.cover}
                      onChange={(e) => { setNewBook({ ...newBook, cover: e.target.value }); setBookError(""); }}
                      placeholder="https://example.com/cover.jpg" className="form-input" />
                  </div>

                  <div className="form-group">
                    <label>Synopsis</label>
                    <textarea required rows={4} value={newBook.synopsis}
                      onChange={(e) => { setNewBook({ ...newBook, synopsis: e.target.value }); setBookError(""); }}
                      placeholder="Synopsis buku" className="form-input form-textarea" />
                  </div>

                  {newBook.cover && (
                    <div className="cover-preview-wrapper">
                      <img src={newBook.cover} alt="Preview cover" className="cover-preview" />
                    </div>
                  )}

                  {bookError && <div className="form-error-box">{bookError}</div>}

                  <div className="form-actions">
                    <button type="button" className="btn-form-cancel"
                      onClick={() => { handleCloseModal(); setActiveSection("dashboard"); }}>
                      Batal
                    </button>
                    <button type="submit" className="btn-form-submit">
                      {isEdit ? "Update Buku" : "Tambah Buku"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ── MANAGE CATEGORY SECTION ── */}
            {activeSection === "manage-category" && (
              <div className="content-section">
                <div className="section-header">
                  <h1>Kelola Kategori</h1>
                  <p>Tambah dan hapus kategori buku</p>
                </div>

                <div className="category-form-wrapper">
                  <div className="category-add-form">
                    <input type="text" className="form-input"
                      placeholder="Nama kategori baru..." value={newCategoryInput}
                      onChange={(e) => { setNewCategoryInput(e.target.value); setCategoryError(""); }}
                      onKeyDown={(e) => e.key === "Enter" && handleAddCategory()} />
                    <button className="btn-add-category" onClick={handleAddCategory}>
                      + Tambah Kategori
                    </button>
                  </div>
                  {categoryError && <p className="form-error-box">{categoryError}</p>}
                </div>

                <div className="category-list-wrapper">
                  <h3>Daftar Kategori ({categories.length})</h3>
                  {categories.length === 0 ? (
                    <p className="empty-state">Belum ada kategori.</p>
                  ) : (
                    <div className="category-grid">
                      {categories.map((cat) => (
                        <div key={cat} className="category-item-card">
                          <span className="category-name">{cat}</span>
                          <button className="btn-delete-category"
                            onClick={() => handleDeleteCategory(cat)} title="Hapus kategori">
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── LIST BOOKS SECTION ── */}
            {activeSection === "list-books" && (
              <div className="content-section">
                <div className="section-header">
                  <h1>Daftar Buku</h1>
                  <p>Lihat, edit, dan hapus buku</p>
                </div>

                <div className="list-controls">
                  <div className="search-wrapper">
                    <input type="text" className="search-input"
                      placeholder="Cari judul atau penulis..." value={search}
                      onChange={(e) => setSearch(e.target.value)} />
                  </div>

                  <div className="filter-wrapper">
                    <select className="filter-select" value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}>
                      <option value="All">Semua Kategori</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="books-count">
                  Menampilkan {filteredBooks.length} dari {books.length} buku
                </div>

                {filteredBooks.length === 0 ? (
                  <div className="empty-state-large">
                    <p>Tidak ada buku yang sesuai dengan pencarian.</p>
                  </div>
                ) : (
                  <div className="books-table-wrapper">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Cover</th>
                          <th>Judul & Penulis</th>
                          <th>Kategori</th>
                          <th>Penerbit</th>
                          <th>Rating</th>
                          <th>Tahun</th>
                          <th>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredBooks.map((book) => (
                          <tr key={book.id}>
                            <td>
                              <div className="book-cover-cell">
                                {book.cover ? (
                                  <img src={book.cover} alt={book.title} className="book-cover-thumb" />
                                ) : (
                                  <div className="cover-missing">📖</div>
                                )}
                              </div>
                            </td>
                            <td>
                              <div className="book-info-cell">
                                <div className="book-title">{book.title}</div>
                                <div className="book-author">{book.author}</div>
                              </div>
                            </td>
                            <td>
                              <span className="badge-category">
                                {book.category || "-"}
                              </span>
                            </td>
                            <td>
                              <span className="book-publisher">
                                {book.publisher || "-"}
                              </span>
                            </td>
                            <td>
                              <span className="book-rating">⭐ {book.rating}</span>
                            </td>
                            <td>{book.year}</td>
                            <td>
                              <div className="action-buttons">
                                <button className="btn-edit"
                                  onClick={() => {
                                    setNewBook(book);
                                    setIsEdit(true);
                                    setActiveSection("add-book");
                                  }}>
                                  ✏️
                                </button>
                                <button className="btn-delete"
                                  onClick={() => handleDelete(book.id)}>
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ── PROFILE SECTION ── */}
            {activeSection === "profile" && (
              <div className="content-section">
                <div className="section-header">
                  <h1>Profil Pengembang</h1>
                  <p>Tentang pembuat aplikasi BookGuide</p>
                </div>

                <div className="profile-developer-card">
                  <div className="profile-photo-wrapper">
                    <img
                      className="profile-photo"
                      src="/foto.webp"
                      alt="Foto profil pengembang"
                    />
                  </div>
                  <div className="profile-info">
                    <h2>Almira Zahra</h2>
                    <p className="profile-role">Pengembang Web</p>
                    <p>
                      Saya fokus pada pembuatan antarmuka yang bersih dan responsif, serta
                      pengalaman pengguna yang nyaman.
                    </p>
                  </div>
                </div>

                <div className="profile-details-section">
                  <h3>Tentang Pengembang</h3>
                  <div className="profile-skills-grid">
                    <div className="skill-item">
                      <span className="skill-icon">⚛️</span>
                      <div className="skill-content">
                        <strong>React & Vite</strong>
                        <p>Pengembangan frontend modern dengan React dan build tool Vite</p>
                      </div>
                    </div>
                    <div className="skill-item">
                      <span className="skill-icon">🎨</span>
                      <div className="skill-content">
                        <strong>UI/UX Design</strong>
                        <p>Mengutamakan pengalaman pengguna dan desain responsif</p>
                      </div>
                    </div>
                    <div className="skill-item">
                      <span className="skill-icon">📚</span>
                      <div className="skill-content">
                        <strong>Data Management</strong>
                        <p>Mengelola data buku dan membuat fitur admin yang mudah digunakan</p>
                      </div>
                    </div>
                    <div className="skill-item">
                      <span className="skill-icon">🔍</span>
                      <div className="skill-content">
                        <strong>Search & Filter</strong>
                        <p>Membangun aplikasi yang membantu pencarian dan rekomendasi buku</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="profile-message-section">
                  <div className="message-card">
                    <h3>💬 Pesan </h3>
                    <p>
                      "Terima kasih telah menggunakan BookGuide! Aplikasi ini dibuat dengan tujuan
                      membantu para pecinta buku menemukan bacaan terbaik. Saya berharap aplikasi
                      ini dapat memberikan pengalaman yang menyenangkan dalam menjelajahi dunia literatur."
                    </p>
                    <div className="message-signature">
                      <span>Pengembang BookGuide</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default AdminDashboard;