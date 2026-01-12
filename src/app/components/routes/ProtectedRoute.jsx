"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingSpinner from "../shared/LoadingSpinner";
import { useAuth } from "@/app/contexts/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (role && user.role !== role) {
        router.push("/library");
      }
    }
  }, [user, loading, role, router]);

  if (loading) return <LoadingSpinner />;

  if (!user || (role && user.role !== role)) return null;

  return <>{children}</>;
}
