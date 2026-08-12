// app/admin/members/page.tsx
"use client";
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/providers/ToastProvider";
import {
  Search,
  Pencil,
  Trash2,
  X,
  Check,
  Loader2,
  Users,
} from "lucide-react";

type Member = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  yearCompleted: number;
  location: string;
  role: "MEMBER" | "ADMIN";
  createdAt: string;
};

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Member>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Member | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { showToast } = useToast();

  const fetchMembers = useCallback(async (query: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/members?search=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load members");
      setMembers(data.members);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to load members", "error");
    } finally {
      setLoading(false);
    }
    []
  }, [showToast]);

  useEffect(() => {
    const timeout = setTimeout(() => fetchMembers(search), 350);
    return () => clearTimeout(timeout);
  }, [search, fetchMembers]);

  const startEdit = (member: Member) => {
    setEditingId(member.id);
    setEditForm(member);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async (id: string) => {
    setSavingId(id);
    try {
      const res = await fetch(`/api/admin/members/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || "Failed to update member", "error");
        return;
      }

      setMembers((prev) => prev.map((m) => (m.id === id ? data.member : m)));
      showToast("Member updated", "success");
      setEditingId(null);
    } catch {
      showToast("Something went wrong", "error");
    } finally {
      setSavingId(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/members/${deleteTarget.id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || "Failed to delete member", "error");
        return;
      }

      setMembers((prev) => prev.filter((m) => m.id !== deleteTarget.id));
      showToast("Member removed", "success");
      setDeleteTarget(null);
    } catch {
      showToast("Something went wrong", "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
          <Users className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-black mt-9">Members</h1>
          <p className="text-sm text-slate-500">
            {loading ? "Loading..." : `${members.length} member${members.length === 1 ? "" : "s"}`}
          </p>
        </div>
      </div>

      <div className="relative mb-5 max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="h-4 w-4" />
        </div>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm text-black placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-600/10"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                </td>
              </tr>
            ) : members.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                  No members found.
                </td>
              </tr>
            ) : (
              members.map((member) => {
                const isEditing = editingId === member.id;
                return (
                  <tr key={member.id} className="border-b border-slate-50 last:border-0">
                    {isEditing ? (
                      <>
                        <td className="px-4 py-2.5">
                          <div className="flex gap-1.5">
                            <input
                              value={editForm.firstName ?? ""}
                              onChange={(e) => setEditForm((f) => ({ ...f, firstName: e.target.value }))}
                              className="w-20 rounded-lg border border-slate-200 px-2 py-1 text-sm text-black focus:border-blue-600 focus:outline-none"
                            />
                            <input
                              value={editForm.lastName ?? ""}
                              onChange={(e) => setEditForm((f) => ({ ...f, lastName: e.target.value }))}
                              className="w-20 rounded-lg border border-slate-200 px-2 py-1 text-sm text-black focus:border-blue-600 focus:outline-none"
                            />
                          </div>
                        </td>
                        <td className="px-4 py-2.5">
                          <input
                            value={editForm.email ?? ""}
                            onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                            className="w-full rounded-lg border border-slate-200 px-2 py-1 text-sm text-black focus:border-blue-600 focus:outline-none"
                          />
                        </td>
                        <td className="px-4 py-2.5">
                          <input
                            value={editForm.phone ?? ""}
                            onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))}
                            className="w-full rounded-lg border border-slate-200 px-2 py-1 text-sm text-black focus:border-blue-600 focus:outline-none"
                          />
                        </td>
                        <td className="px-4 py-2.5">
                          <input
                            value={editForm.location ?? ""}
                            onChange={(e) => setEditForm((f) => ({ ...f, location: e.target.value }))}
                            className="w-full rounded-lg border border-slate-200 px-2 py-1 text-sm text-black focus:border-blue-600 focus:outline-none"
                          />
                        </td>
                        <td className="px-4 py-2.5">
                          <select
                            value={editForm.role ?? "MEMBER"}
                            onChange={(e) =>
                              setEditForm((f) => ({ ...f, role: e.target.value as Member["role"] }))
                            }
                            className="rounded-lg border border-slate-200 px-2 py-1 text-sm text-black focus:border-blue-600 focus:outline-none"
                          >
                            <option value="MEMBER">Member</option>
                            <option value="ADMIN">Admin</option>
                          </select>
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => saveEdit(member.id)}
                              disabled={savingId === member.id}
                              className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
                            >
                              {savingId === member.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Check className="h-3.5 w-3.5" />
                              )}
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3 font-medium text-black">
                          {member.firstName} {member.lastName}
                        </td>
                        <td className="px-4 py-3 text-slate-600">{member.email}</td>
                        <td className="px-4 py-3 text-slate-600">{member.phone}</td>
                        <td className="px-4 py-3 text-slate-600">{member.location}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              member.role === "ADMIN"
                                ? "bg-blue-50 text-blue-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {member.role === "ADMIN" ? "Admin" : "Member"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => startEdit(member)}
                              className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-blue-600"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(member)}
                              className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-rose-50 hover:text-rose-600"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-black mb-1.5">Remove member?</h2>
            <p className="text-sm text-slate-500 mb-6">
              This will permanently remove{" "}
              <span className="font-medium text-black">
                {deleteTarget.firstName} {deleteTarget.lastName}
              </span>{" "}
              and their account. This can&apos;t be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-60"
              >
                {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}