"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, User as UserIcon, X } from "lucide-react";

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
  profileImageUrl: string | null;
};

export default function MemberProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageOpen, setImageOpen] = useState(false);

  useEffect(() => {
    const fetchMember = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/members/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load member");
        setMember(data.member);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchMember();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="py-20 text-center text-slate-500">
        {error || "Member not found."}
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-1.5 text-sm text-slate-500 hover:text-black"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to members
      </button>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          {member.profileImageUrl ? (
            <img
              src={member.profileImageUrl}
              alt={`${member.firstName} ${member.lastName}`}
              onClick={() => setImageOpen(true)}
              className="h-16 w-16 rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <UserIcon className="h-7 w-7" />
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold text-black">
              {member.firstName} {member.lastName}
            </h1>
            <span
              className={`inline-flex mt-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                member.role === "ADMIN"
                  ? "bg-blue-50 text-blue-700"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {member.role === "ADMIN" ? "Admin" : "Member"}
            </span>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
          <div>
            <dt className="text-slate-400">Email</dt>
            <dd className="text-black">{member.email}</dd>
          </div>
          <div>
            <dt className="text-slate-400">Phone</dt>
            <dd className="text-black">{member.phone}</dd>
          </div>
          <div>
            <dt className="text-slate-400">Gender</dt>
            <dd className="text-black">{member.gender}</dd>
          </div>
          <div>
            <dt className="text-slate-400">Location</dt>
            <dd className="text-black">{member.location}</dd>
          </div>
          <div>
            <dt className="text-slate-400">Year Completed</dt>
            <dd className="text-black">{member.yearCompleted}</dd>
          </div>
          <div>
            <dt className="text-slate-400">Joined</dt>
            <dd className="text-black">
              {new Date(member.createdAt).toLocaleDateString()}
            </dd>
          </div>
        </dl>
      </div>

      {imageOpen && member.profileImageUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
          onClick={() => setImageOpen(false)}
        >
          <img
            src={member.profileImageUrl}
            alt={`${member.firstName} ${member.lastName}`}
            className="max-h-[85vh] max-w-full rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setImageOpen(false)}
            className="absolute top-6 right-6 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
