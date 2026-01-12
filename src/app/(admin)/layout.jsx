"use client";

import ProtectedRoute from "../components/routes/ProtectedRoute";
import AdminSidebar from "../components/shared/AdminSidebar";

export default function AdminLayout({ children }) {
  return (
    <ProtectedRoute role="admin">
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
