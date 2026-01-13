"use client";
import api from "@/app/lib/api";
import { useEffect, useState } from "react";
import {
  Search,
  ShieldCheck,
  ShieldAlert,
  Trash2,
  User,
  UserCog,
  Loader2,
  ChevronRight,
  BadgeCheck,
  TriangleAlert,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [emailToPromote, setEmailToPromote] = useState("");

  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const [confirmAction, setConfirmAction] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      toast.error("Failed to sync personnel registry.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const promoteByEmail = async (e) => {
    e.preventDefault();
    if (!emailToPromote) return;

    setIsProcessing(true);
    try {
      await api.put("/admin/promote", { email: emailToPromote });
      toast.success(`Clearance granted to ${emailToPromote}`);
      setEmailToPromote("");
      fetchUsers();
    } catch (err) {
      toast.error("Promotion protocol failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePromote = async (user) => {
    setIsProcessing(true);
    try {
      await api.put("/admin/promote", { email: user.email });
      toast.success(`${user.name} elevated to Admin.`);
      fetchUsers();
    } catch (err) {
      toast.error("Update failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  const executeConfirmAction = async () => {
    if (!confirmAction) return;
    setIsProcessing(true);

    try {
      if (confirmAction.type === "demote") {
        await api.put("/admin/demote", { email: confirmAction.user.email });
        toast.success("Security clearance revoked.");
      } else if (confirmAction.type === "delete") {
        await api.delete(`/admin/users/${confirmAction.user._id}`);
        toast.success("Personnel record expunged.");
      }
      fetchUsers();
      setConfirmAction(null);
    } catch (err) {
      toast.error("Administrative action failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-32 animate-pulse">
        <Loader2 className="animate-spin text-stone-300 mb-4" size={40} />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">
          Loading Registry...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#fdfbf7] py-20 pb-32">
      <div className="max-w-6xl mx-auto px-6">
        {isProcessing && (
          <div className="fixed inset-0 z-[100] bg-stone-900/20 backdrop-blur-[2px] flex items-center justify-center pointer-events-auto">
            <div className="bg-white border-2 border-stone-900 p-6 flex items-center gap-4 shadow-2xl animate-in zoom-in-95">
              <Loader2 className="animate-spin text-emerald-800" size={24} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-900">
                Updating Records...
              </span>
            </div>
          </div>
        )}

        <header className="mb-12 border-b-4 border-stone-900 pb-8">
          <div className="flex items-center gap-2 mb-2">
            <Users className="text-emerald-800" size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-800">
              Human Resources Oversight
            </span>
          </div>
          <h1 className="text-5xl font-serif font-bold text-stone-900 italic tracking-tight">
            Personnel{" "}
            <span className="text-stone-400 decoration-stone-300 underline underline-offset-8 decoration-2">
              Registry
            </span>
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Search Box */}
          <div className="lg:col-span-2 bg-white border-2 border-stone-900 p-1 flex items-center shadow-[4px_4px_0px_0px_rgba(28,25,23,0.05)] focus-within:shadow-none transition-shadow">
            <div className="p-4 text-stone-400">
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Search Personnel by Name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-full bg-transparent font-serif text-lg focus:outline-none placeholder:text-stone-300 placeholder:italic text-stone-900"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredUsers.length === 0 ? (
            <p className="col-span-full text-center text-stone-400 italic py-12">
              No matching personnel records found.
            </p>
          ) : (
            filteredUsers.map((u) => (
              <div
                key={u._id}
                className={`relative border-2 ${
                  u.role === "admin"
                    ? "border-emerald-800 bg-emerald-50/30"
                    : "border-stone-200 bg-white"
                } p-6 transition-all hover:border-stone-900 group`}
              >
                {/* ID Badge */}
                <div className="absolute top-4 right-4 font-mono text-[9px] text-stone-400 uppercase tracking-widest">
                  ID: {u._id.slice(-6)}
                </div>

                <div className="flex items-start gap-4 mb-6">
                  <div
                    className={`p-3 rounded-full border-2 w-14 h-14 flex items-center justify-center overflow-hidden ${
                      u.role === "admin"
                        ? "bg-emerald-100 border-emerald-200 text-emerald-800"
                        : "bg-stone-100 border-stone-200 text-stone-400"
                    }`}
                  >
                    {u.photo ? (
                      <Image
                        height={48}
                        width={48}
                        src={u.photo}
                        alt={u.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : u.role === "admin" ? (
                      <UserCog size={24} />
                    ) : (
                      <User size={24} />
                    )}
                  </div>

                  <div>
                    <h3 className="text-xl font-serif font-bold text-stone-900 leading-tight">
                      {u.name}
                    </h3>
                    <p className="font-mono text-xs text-stone-500 mt-1">
                      {u.email}
                    </p>
                    <div
                      className={`inline-flex items-center gap-1 mt-3 px-2 py-1 text-[9px] font-black uppercase tracking-widest border ${
                        u.role === "admin"
                          ? "border-emerald-200 text-emerald-800 bg-emerald-100"
                          : "border-stone-200 text-stone-500 bg-stone-50"
                      }`}
                    >
                      {u.role === "admin" ? <BadgeCheck size={10} /> : null}
                      {u.role === "admin"
                        ? "Security Clearance: Level 4"
                        : "Standard Access"}
                    </div>
                  </div>
                </div>

                <div className="border-t border-stone-100 pt-4 flex justify-between items-center opacity-80 group-hover:opacity-100 transition-opacity">
                  {u.role === "user" ? (
                    <button
                      onClick={() => handlePromote(u)}
                      className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-800 transition-colors"
                    >
                      <ShieldCheck size={14} /> Grant Admin
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        setConfirmAction({ type: "demote", user: u })
                      }
                      className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-yellow-600 transition-colors"
                    >
                      <ShieldAlert size={14} /> Demote
                    </button>
                  )}

                  {/* Delete */}
                  <button
                    onClick={() =>
                      setConfirmAction({ type: "delete", user: u })
                    }
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-700 transition-colors"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            onClick={() => setConfirmAction(null)}
          />
          <div className="relative bg-[#fdfbf7] border-[6px] border-stone-900 p-10 max-w-md w-full animate-in zoom-in-95 shadow-2xl">
            <div className="flex flex-col items-center text-center">
              <div
                className={`border-2 p-4 mb-6 ${
                  confirmAction.type === "delete"
                    ? "bg-red-100 border-red-200 text-red-700"
                    : "bg-yellow-100 border-yellow-200 text-yellow-700"
                }`}
              >
                <TriangleAlert size={32} />
              </div>

              <h2 className="text-2xl font-serif font-bold text-stone-900 italic mb-2">
                {confirmAction.type === "delete"
                  ? "Expunge Record?"
                  : "Revoke Clearance?"}
              </h2>

              <p className="text-[10px] uppercase tracking-[0.2em] font-black text-stone-400 mb-6">
                Action Required: {confirmAction.user.name}
              </p>

              <p className="text-stone-600 font-serif italic text-lg leading-relaxed mb-8">
                {confirmAction.type === "delete"
                  ? "This action will permanently remove the user from the registry. This cannot be undone."
                  : "The user will lose administrative privileges and revert to standard access."}
              </p>

              <div className="flex flex-col w-full gap-3">
                <button
                  onClick={executeConfirmAction}
                  className={`w-full text-stone-100 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${
                    confirmAction.type === "delete"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-yellow-600 hover:bg-yellow-700"
                  }`}
                >
                  {confirmAction.type === "delete"
                    ? "Confirm Deletion"
                    : "Confirm Demotion"}
                </button>
                <button
                  onClick={() => setConfirmAction(null)}
                  className="w-full bg-transparent text-stone-400 py-2 text-[10px] font-black uppercase tracking-widest hover:text-stone-900 transition-colors"
                >
                  Cancel Protocol
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
