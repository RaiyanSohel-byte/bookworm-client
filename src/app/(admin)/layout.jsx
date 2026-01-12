import ProtectedRoute from "../components/routes/ProtectedRoute";
import AdminSidebar from "../components/shared/AdminSidebar";

export default function AdminLayout({ children }) {
  return (
    <ProtectedRoute role="admin">
      <div className="lg:flex h-screen">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
