import { useState } from "react";
import initialBooks from "../data/book";
import SidebarFilter from "../components/SidebarFilter";
import "./Recomendation.css";
import { Link } from "react-router-dom";

const normalizeLanguage = (language) =>
  language === "English" || language === "Inggris" ? "Inggris" : language;

// Baca buku dari localStorage agar sinkron dengan perubahan di panel admin
function getBooksFromStorage() {
  try {
    const saved = localStorage.getItem("books");
    return saved ? JSON.parse(saved) : initialBooks;
  } catch {
    return initialBooks;
  }
}

function Recomendation() {
  // Gunakan buku dari localStorage, bukan langsung dari file data
  const books = getBooksFromStorage();

  const [search, setSearch] = useState("");

  const [filters, setFilters] = useState({
    year: "",
    category: "",
    rating: [],
    author: "",
    publisher: "",
    language: [],
  });

  const filteredBooks = (books || [])
    .filter((book) => {
      const keyword = search.toLowerCase();
      return (
        book.title?.toLowerCase().includes(keyword) ||
        book.author?.toLowerCase().includes(keyword)
      );
    })
    .filter((book) =>
      filters.year ? book.year === Number(filters.year) : true
    )
    .filter((book) =>
      filters.category ? book.category === filters.category : true
    )
    .filter((book) =>
      filters.rating.length > 0
        ? filters.rating.includes(Number(book.rating))
        : true
    )
    .filter((book) =>
      filters.author ? book.author === filters.author : true
    )
    .filter((book) =>
      filters.publisher ? book.publisher === filters.publisher : true
    )
    .filter((book) =>
      filters.language.length > 0
        ? filters.language.includes(normalizeLanguage(book.language))
        : true
    )
    .slice(0, 27);

  return (
    <div className="recomendation-page">

      {/* HEADER */}
      <section className="recomendation-header">
        <h1>Daftar Rekomendasi Terbaik</h1>
        <p>Jelajahi {books.length} buku dari berbagai genre dan penulis</p>
      </section>

      {/* SEARCH */}
      <div className="container py-4">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            placeholder="Cari judul buku atau penulis"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* CONTENT */}
      <div className="container">
        <div className="row">

          {/* FILTER — kirim books dari localStorage agar opsi filter ikut update */}
          <div className="col-md-3">
            <SidebarFilter
              filters={filters}
              setFilters={setFilters}
              books={books}
            />
          </div>

          {/* LIST BUKU */}
          <div className="col-md-9">
            <div className="row">

              {filteredBooks.length === 0 ? (
                <p style={{ padding: "2rem", opacity: 0.6 }}>
                  Tidak ada buku yang sesuai filter.
                </p>
              ) : (
                filteredBooks.map((book) => (
                  <div className="col-md-4 mb-4" key={book.id}>
                    <Link to={`/book/${book.id}`} className="book-link">
                      <div className="book-card">
                        <img
                          src={book.cover}
                          alt={book.title}
                          onError={(e) => {
                            e.target.src = "/people.webp";
                          }}
                        />
                        <div className="book-info">
                          <small>{book.category}</small>
                          <h5>{book.title}</h5>
                          <p>{book.author}</p>
                          <div className="book-footer">
                            <span>⭐ {book.rating}</span>
                            <span>{book.year}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))
              )}

            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

export default Recomendation;