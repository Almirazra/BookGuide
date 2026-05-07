import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Recomendation from "./pages/Recomendation";
import BookDetail from "./pages/DetailBook";
import Category from "./pages/Category";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminAccess from "./pages/AdminAccess";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Navbar />}

      {/* page-wrapper agar konten tidak tertutup navbar fixed-top */}
      <div style={!isAdmin ? { paddingTop: "70px" } : {}}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rekomendasi" element={<Recomendation />} />
          <Route path="/book/:id" element={<BookDetail />} />
          <Route path="/kategori" element={<Category />} />
          <Route path="/kontak" element={<Contact />} />
          <Route path="/profile" element={<Profile />} />

          <Route path="/admin-access" element={<AdminAccess />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>

      {!isAdmin && <Footer />}
    </>
  );
}

export default App;