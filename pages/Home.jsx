import books from "../data/book";
import BookCard from "../components/BookCard";
import { Link } from "react-router-dom";
import "./Home.css";


function Home() {
  const recommended = books.slice(0, 4);
  const totalBooks = books.length;
  const totalAuthors = new Set(
    books.map((book) => book.author?.trim()).filter(Boolean)
  ).size;

  return (
    <div className="home-page">
      
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="overlay">
          <h1>Rekomendasi Buku</h1>
          <p>
            Temukan buku-buku terbaik dari berbagai genre dan penulis ternama.
          </p>
          <p>
            Koleksi kami yang dikurasi dengan cermat membantu Anda menemukan bacaan sempurna.
          </p>

          <div className="hero-buttons">
            <Link to="/rekomendasi" className="btn btn-orange">
              Jelajahi Buku →
            </Link>

            <Link to="/kategori" className="btn btn-outline-light">
              Lihat Kategori
            </Link>
          </div>
        </div>
      </section>

      {/* STATISTIK */}
      <section className="stats-section">
        <div className="stat-box">
          <h2>{totalBooks}</h2>
          <p>Total buku</p>
        </div>

        <div className="stat-box">
          <h2>{totalAuthors}</h2>
          <p>Penulis</p>
        </div>

        <div className="stat-box">
          <h2>2</h2>
          <p>Bahasa</p>
        </div>
      </section>

      {/* REKOMENDASI */}
      <section className="container py-5">
        <h2 className="text-center mb-5">Rekomendasi Terbaik</h2>

        <div className="row">
          {recommended.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>

        <div className="text-center mt-4">
          <Link to="/rekomendasi" className="see-more">
            Lihat semua rekomendasi →
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
