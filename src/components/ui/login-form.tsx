"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

import { Eye, EyeOff, Lock, User, ArrowRight } from "lucide-react";

import { useToast } from "@/components/providers/ToastProvider";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const { showToast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.email || !formData.password) {
      setErrorMessage("Please fill in all credentials.");
      return;
    }

    setLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      setLoading(false);

      if (result?.error) {
        setErrorMessage("Login failed. Please try again.");
        showToast("Login failed. Please try again.", "error");
        return;
      }

      router.push("/dashboard");
    } catch (error) {
      setLoading(false);
      setErrorMessage("Login failed. Please try again.");
      console.error("Login error:", error);
    }
  };

  return (
    <div className="bg-white py-8 px-6 border-2 border-slate-950 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:px-8">
      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl border-2 border-slate-950 bg-rose-100 text-rose-900 font-bold text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          ⚠️ {errorMessage}
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* EMAIL INPUT */}
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-black uppercase tracking-wider text-slate-950 mb-2"
          >
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <User className="h-5 w-5" />
            </div>
            <input
              id="email"
              name="email"
              type="text"
              required
              placeholder="e.g. member@ossa.org"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="block w-full pl-11 pr-4 py-3 bg-[#f7f5ef] border-2 border-slate-950 rounded-xl font-semibold text-slate-950 placeholder-slate-400 focus:outline-none focus:ring-0 focus:bg-white focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all text-sm"
            />
          </div>
        </div>

        {/* PASSWORD INPUT */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="password"
              className="block text-xs font-black uppercase tracking-wider text-slate-950"
            >
              Password
            </label>
            <Link
              href="#"
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Lock className="h-5 w-5" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="••••••••••••"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="block w-full pl-11 pr-11 py-3 bg-[#f7f5ef] border-2 border-slate-950 rounded-xl font-semibold text-slate-950 placeholder-slate-400 focus:outline-none focus:ring-0 focus:bg-white focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-950 focus:outline-none"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* REMEMBER ME */}
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 rounded border-2 border-slate-950 text-blue-600 focus:ring-0 cursor-pointer accent-blue-600"
          />
          <label
            htmlFor="remember-me"
            className="ml-2.5 block text-xs font-bold text-slate-700 cursor-pointer"
          >
            Remember me on this device
          </label>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white py-3.5 px-4 border-2 border-slate-950 rounded-xl font-black uppercase tracking-wider text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-60"
        >
          {loading ? (
            <span>Authenticating...</span>
          ) : (
            <>
              <span>Sign In to Portal</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* FOOTER LINK */}
      <div className="mt-8 border-t-2 border-slate-200 pt-6 text-center">
        <p className="text-xs font-semibold text-slate-600">
          Not a member yet?{" "}
          <Link
            href="/register"
            className="font-black text-blue-600 uppercase tracking-wide hover:underline ml-1"
          >
            Register Now
          </Link>
        </p>
      </div>
    </div>
  );
}
