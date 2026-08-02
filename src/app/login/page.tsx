import LoginForm from "@/components/ui/login-form";
import { ShieldCheck } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#f7f5ef] text-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* HEADER SECTION */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center gap-2 bg-[#0b4f6c] text-white px-4 py-1.5 rounded-full border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs font-black uppercase tracking-widest mb-4">
          <ShieldCheck className="w-4 h-4 text-[#FF6B35]" />
          <span>OSSA Portal Access</span>
        </div>
        <h2 className="text-3xl font-black uppercase tracking-tight text-slate-950 sm:text-4xl">
          Welcome Back
        </h2>
        <p className="mt-2 text-sm font-semibold text-slate-600">
          Sign in to manage your membership and OSSA activities.
        </p>
      </div>

      {/* REUSABLE COMPONENT */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <LoginForm />
      </div>
    </div>
  );
}
