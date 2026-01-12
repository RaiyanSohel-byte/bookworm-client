import ProtectedRoute from "../components/routes/ProtectedRoute";
import Footer from "../components/shared/Footer";
import Navbar from "../components/shared/Navbar";

export default function UserLayout({ children }) {
  return (
    <ProtectedRoute role="user">
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </ProtectedRoute>
  );
}
