"use client";

import { useRouter } from "next/navigation";
import LoadingSpinner from "../shared/LoadingSpinner";
import { useAuth } from "@/app/contexts/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) return <LoadingSpinner />;

  if (!user) {
    router.push("/login");
    return null;
  }

  if (role && user.role !== role) {
    router.push("/library");
    return null;
  }

  return children;
}
