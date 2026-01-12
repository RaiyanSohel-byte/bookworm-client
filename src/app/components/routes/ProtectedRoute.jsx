"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import LoadingSpinner from "../shared/LoadingSpinner";

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
