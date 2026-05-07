import { useState } from "react";
import { Link } from "react-router-dom";
import initialBooks from "../data/book";
import "./Category.css";

// Palet warna untuk kategori — dipakai berulang jika kategori lebih banyak dari warna
const COLOR_PALETTE = [
  "#e8547a", // pink/rose
  "#3aaa7a", // hijau
  "#6c3fd6", // ungu
  "#f5a623", // oranye
  "#2196f3", // biru
  "#e91e8c", // magenta
  "#00bcd4", // cyan
  "#ff5722", // merah-oranye
  "#8bc34a", // hijau muda
  "#9c27b0", // violet
];

// Ambil warna berdasarkan index, berputar jika kategori lebih dari panjang palet
function getColor(index) {
  return COLOR_PALETTE[index % COLOR_PALETTE.length];
}

// Baca buku dari localStorage jika ada, fallback ke data awal
function getBooksFromStorage() {
  try {
    const saved = localStorage.getItem("books");
    return saved ? JSON.parse(saved) : initialBooks;
  } catch {
    return initialBooks;
  }
}

// Baca daftar kategori dari localStorage jika ada
// Fallback: ambil kategori unik dari data buku
function getCategoriesFromStorage(books) {
  try {
    const saved = localStorage.getItem("categories");
    if (saved) return JSON.parse(saved);
  } catch { /* lanjut ke fallback */ }
  return [...new Set(books.map((b) => b.category).filter(Boolean))];
}

function Category() {
  // Baca buku & kategori dari localStorage agar sinkron dengan panel admin
  const books = getBooksFromStorage();
  const categories = getCategoriesFromStorage(books);

  // State kategori yang sedang dipilih (null = belum ada)
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Filter buku berdasarkan kategori yang dipilih
  const filteredBooks = selectedCategory
    ? books.filter((book) => book.category === selectedCategory)
    : [];

  return (
    <div className="category-page">
      <h1 className="category-title">Kategori Buku</h1>

      {/* ===== Daftar Kartu Kategori ===== */}
      <div className="category-grid">
        {categories.map((category, index) => {
          // Hitung jumlah buku di setiap kategori
          const totalBooks = books.filter(
            (book) => book.category === category
          ).length;

          // Cek apakah kategori ini sedang aktif/dipilih
          const isActive = selectedCategory === category;

          // Ambil warna dari palet berdasarkan urutan index
          const accentColor = getColor(index);

          return (
            <div
              key={category}
              className={`category-card ${isActive ? "active" : ""}`}
              style={{ "--accent": accentColor }}
              // Klik: jika sudah aktif maka deselect, jika belum maka pilih
              onClick={() => setSelectedCategory(isActive ? null : category)}
            >
              <div className="category-card__icon">📚</div>
              <h4 className="category-card__name">{category}</h4>
              <p className="category-card__count">{totalBooks} Buku</p>
              <div className="category-card__bar" />
            </div>
          );
        })}
      </div>

      {/* ===== Pesan jika belum ada kategori ===== */}
      {categories.length === 0 && (
        <p style={{ textAlign: "center", opacity: 0.6, marginTop: "2rem" }}>
          Belum ada kategori. Tambahkan melalui panel admin.
        </p>
      )}

      {/* ===== Daftar Buku (hanya tampil jika ada kategori yang dipilih) ===== */}
      {selectedCategory && (
        <div className="book-section">
          <h2 className="book-section__title">
            Buku —{" "}
            <span
              className="book-section__label"
              style={{ color: getColor(categories.indexOf(selectedCategory)) }}
            >
              {selectedCategory}
            </span>
          </h2>

          {/* Tampilkan pesan jika tidak ada buku di kategori ini */}
          {filteredBooks.length === 0 ? (
            <p className="book-section__empty">Tidak ada buku di kategori ini.</p>
          ) : (
            <div className="book-grid">
              {filteredBooks.map((book, index) => (
                <Link
                  to={`/book/${book.id}`}
                  className="book-card"
                  key={`${book.id}-${index}`}
                >
                  {/* Tampilkan cover buku jika tersedia */}
                  {book.cover && (
                    <img
                      src={book.cover}
                      className="book-card__cover"
                      alt={book.title}
                    />
                  )}
                  <div className="book-card__body">
                    <h5 className="book-card__title">{book.title}</h5>
                    {/* Tampilkan nama penulis jika tersedia */}
                    {book.author && (
                      <p className="book-card__author">{book.author}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Category;