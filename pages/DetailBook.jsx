import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import books from "../data/book";
import "./BookDetail.css";

function BookDetail() {
  const { id } = useParams();
  const book = books.find((b) => b.id === parseInt(id));

  const [userReviews, setUserReviews] = useState([]);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [error, setError] = useState("");

  const reviews = userReviews;

  // Ambil review dari localStorage saat halaman dibuka
  useEffect(() => {
    const saved = localStorage.getItem(`reviews-${id}`);
    setUserReviews(saved ? JSON.parse(saved) : []);
  }, [id]);

  // Simpan review ke localStorage setiap kali reviews berubah
  useEffect(() => {
    localStorage.setItem(`reviews-${id}`, JSON.stringify(userReviews));
  }, [userReviews, id]);

  // Handle submit form review
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validasi: semua field harus diisi
    const trimmedName = name.trim();
    const trimmedComment = comment.trim();

    if (!trimmedName || !trimmedComment || rating === 0) {
      setError("Nama, komentar, dan rating harus diisi.");
      return;
    }

    const isDuplicate = reviews.some(
      (review) =>
        review.name.toLowerCase() === trimmedName.toLowerCase() &&
        review.comment.toLowerCase() === trimmedComment.toLowerCase() &&
        review.rating === rating
    );

    if (isDuplicate) {
      setError("Review yang sama sudah ada.");
      return;
    }

    const newReview = {
      id: Date.now(),
      name: trimmedName,
      comment: trimmedComment,
      rating,
      date: new Date().toLocaleDateString(),
    };

    // Tambahkan review baru di paling atas
    setUserReviews([newReview, ...userReviews]);

    // Reset form setelah submit
    setName("");
    setComment("");
    setRating(0);
    setError("");
  };

  // Tampilkan pesan jika buku tidak ditemukan
  if (!book) return <h2 style={{ color: "white" }}>Buku tidak ditemukan</h2>;

  return (
    <div className="detail-page">
      <div className="container py-5">

        {/* ===== DETAIL BUKU ===== */}
        <div className="detail-card">

          {/* Cover buku */}
          <div className="detail-image">
            <img src={book.cover} alt={book.title} />
          </div>

          {/* Info buku */}
          <div className="detail-info">
            <small className="category">{book.category}</small>
            <h1>{book.title}</h1>
            <p className="author">oleh {book.author}</p>

            {/* Rating, tahun, penerbit */}
            <div className="meta">
              <span>⭐ {book.rating}</span>
              <span>{book.year}</span>
              <span>{book.publisher}</span>
            </div>

            <h4 className="desc-title">Sinopsis</h4>
            <p className="synopsis">
              {book.synopsis || "Tidak ada sinopsis tersedia."}
            </p>
          </div>
        </div>

        {/* ===== SECTION REVIEW ===== */}
        <div className="review-section">
          <div className="review-heading">
            <div>
              <h3>Review Pembaca</h3>
            </div>
          </div>

          {/* Form review */}
          <form onSubmit={handleSubmit} className="review-form">
            <h4>Tulis Review</h4>

            {/* Input nama */}
            <input
              type="text"
              placeholder="Nama kamu"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            {/* Input komentar */}
            <textarea
              placeholder="Tulis komentar..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            {/* Bintang rating interaktif */}
            <div className="star-input">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star 
                    ${star <= rating ? "active" : ""} 
                    ${star <= hover ? "hover" : ""}`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                >
                  ★
                </span>
              ))}
            </div>

            {/* Teks deskripsi rating */}
            <p className="rating-text">
              {rating === 5 && "Sangat bagus!"}
              {rating === 4 && "Bagus 👍"}
              {rating === 3 && "Lumayan"}
              {rating === 2 && "Kurang"}
              {rating === 1 && "Buruk 😢"}
            </p>

            {error && <p className="form-error">{error}</p>}

            {/* Tombol submit - warna oranye */}
            <button type="submit" className="btn-submit">
              Kirim Review
            </button>
          </form>

          {/* ===== DAFTAR REVIEW ===== */}
          <div className="review-list">

            {/* Tampilkan setiap review */}
            {reviews.map((r) => (
              <div key={r.id} className="review-card">

                <div className="review-header">
                  {/* Info user */}
                  <div className="review-user">
                    {/* Avatar huruf pertama nama */}
                    <div className="avatar">
                      {r.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h5>{r.name}</h5>
                      <small>
                        {r.date}
                      </small>
                    </div>
                  </div>

                  {/* Bintang rating */}
                  <div className="review-rating">
                    {"⭐".repeat(r.rating)}
                  </div>
                </div>

                {/* Isi komentar */}
                <p className="review-text">{r.comment}</p>

              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

export default BookDetail;
