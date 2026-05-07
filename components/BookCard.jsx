import { Link } from "react-router-dom";

function BookCard({ book }) {
  return (
    <div className="col-md-6 mb-4">
      <Link to={`/book/${book.id}`} className="book-link" style={{ textDecoration: 'none' }}>
        <div
          className="card p-3 border-0 shadow-sm"
          style={{
            backgroundColor: "#b3a59c",
            borderRadius: "12px",
            cursor: "pointer",
            transition: "transform 0.2s",
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          <div className="d-flex align-items-center">
            <img
              src={book.cover}
              alt={book.title}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/people.webp"; // fallback 
              }}
              style={{
                width: "100px",
                height: "140px",
                objectFit: "cover",
                borderRadius: "6px",
              }}
            />

            <div className="ms-3">
              <small style={{ color: "#333" }}>{book.category}</small>
              <h4 style={{ color: "#333" }}>{book.title}</h4>
              <p className="mb-1" style={{ color: "#333" }}>{book.author}</p>
              <p style={{ color: "#333" }}>⭐ {book.rating}</p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default BookCard;