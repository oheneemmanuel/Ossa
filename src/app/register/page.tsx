import RegisterForm from "@/components/ui/register-form";
import { UserPlus } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#f7f5ef] text-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* HEADER SECTION */}
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-[#0b4f6c] text-white px-4 py-1.5 rounded-full border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs font-black uppercase tracking-widest mb-3">
          <UserPlus className="w-4 h-4 text-[#FF6B35]" />
          <span>Membership Application</span>
        </div>
        <h1 className="text-3xl font-black uppercase tracking-tight text-slate-950 sm:text-4xl">
          Join OSSA Network
        </h1>
        <p className="mt-2 text-sm font-semibold text-slate-600">
          Register to connect with science alumni, track dues, and participate
          in association activities.
        </p>
      </div>

      {/* FORM CARD CONTAINER */}
      <div className="sm:mx-auto sm:w-full sm:max-w-xl px-4">
        <RegisterForm />
      </div>
    </div>
  );
}
