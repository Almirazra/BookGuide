import "./SidebarFilter.css";

const normalizeLanguage = (language) =>
  language === "English" || language === "Inggris" ? "Inggris" : language;

function SidebarFilter({ filters, setFilters, books }) {

  const categories = [...new Set(books.map(b => b.category))];
  const authors = [...new Set(books.map(b => b.author))];
  const publishers = [...new Set(books.map(b => b.publisher))];
  const languages = [...new Set(books.map((b) => normalizeLanguage(b.language)))];
  const ratings = [...new Set(books.map((b) => Number(b.rating)))]
    .sort((a, b) => b - a);
  const years = books.map((b) => b.year);
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);

  return (
    <div className="filter-box">

      <h4>Filter</h4>

      {/* Tahun */}
      <div className="mb-4">
        <label>Tahun Terbit</label>
        <input
          type="range"
          min={minYear}
          max={maxYear}
          value={filters.year || maxYear}
          onChange={(e) =>
            setFilters({ ...filters, year: e.target.value })
          }
          className="form-range"
        />
        <p>{filters.year || maxYear}</p>
      </div>

      {/* Kategori */}
      <div className="mb-4">
        <label>Kategori</label>
        <div className="d-flex flex-wrap gap-2">
          {categories.map((cat, i) => (
            <button
              key={i}
              className={`btn btn-sm ${
                filters.category === cat ? "btn-active" : "btn-light"
              }`}
              onClick={() =>
                setFilters({
                  ...filters,
                  category: filters.category === cat ? "" : cat,
                })
              }
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div className="mb-4">
        <label>Rating</label>

        {ratings.map((r) => (
          <div key={r}>
            <input
              type="checkbox"
              checked={filters.rating.includes(r)}
              onChange={() => {
                const newRatings = filters.rating.includes(r)
                  ? []
                  : [r];

                setFilters({ ...filters, rating: newRatings });
              }}
            />
            <span> ⭐ {r}</span>
          </div>
        ))}
      </div>

      {/* Penulis */}
      <div className="mb-4">
        <label>Penulis</label>
        <select
          className="form-select"
          value={filters.author}
          onChange={(e) =>
            setFilters({ ...filters, author: e.target.value })
          }
        >
          <option value="">Pilih Penulis</option>
          {authors.map((a, i) => (
            <option key={i}>{a}</option>
          ))}
        </select>
      </div>

      {/* Penerbit */}
      <div className="mb-4">
        <label>Penerbit</label>
        <select
          className="form-select"
          value={filters.publisher}
          onChange={(e) =>
            setFilters({ ...filters, publisher: e.target.value })
          }
        >
          <option value="">Pilih Penerbit</option>
          {publishers.map((p, i) => (
            <option key={i}>{p}</option>
          ))}
        </select>
      </div>

      {/* Bahasa */}
      <div className="mb-4">
        <label>Bahasa</label>

        {languages.map((lang) => (
          <div key={lang}>
            <input
              type="checkbox"
              checked={filters.language.includes(lang)}
              onChange={() => {
                const newLang = filters.language.includes(lang)
                  ? []
                  : [lang];

                setFilters({ ...filters, language: newLang });
              }}
            />
            <span> {lang}</span>
          </div>
        ))}
      </div>

      {/* Reset */}
      <button
        className="reset-btn"
        onClick={() =>
          setFilters({
            year: "",
            category: "",
            rating: [],
            author: "",
            publisher: "",
            language: [],
          })
        }
      >
        Reset
      </button>

    </div>
  );
}

export default SidebarFilter;
