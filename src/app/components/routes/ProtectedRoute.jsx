"use client";
import { useAuth } from "@/context/AuthContext";
import { redirect } from "next/navigation";

export default function ProtectedRoute({ children, role }) {
  const { user } = useAuth();
  if (!user) redirect("/login");
  if (role && user.role !== role) redirect("/library");
  return children;
}
