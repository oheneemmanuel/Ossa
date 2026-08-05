"use client";

import { useState, useTransition } from "react";
import { createUserAccount } from "@/lib/actions/auth";
import { useRouter } from "next/navigation";

import Link from "next/link";
import { useToast } from "@/components/providers/ToastProvider";

import {
  User,
  Mail,
  Lock,
  MapPin,
  Calendar,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { showToast } = useToast();
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "male",
    yearCompleted: "",
    location: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Basic client-side validation (mirrors server rules)
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (formData.password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    startTransition(async () => {
      const fd = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        fd.append(key, value);
      });

      const result = await createUserAccount(fd);

      if (!result.success) {
        setErrorMessage(result.error ?? "Something went wrong.");
        showToast(result.error ?? "Something went wrong.", "error");
        return;
      }

      setSuccessMessage(result.message ?? "Account created successfully.");
      showToast(result.message ?? "Account created successfully.", "success");

      // Redirect to login page on success
      router.push('/login');

      // Reset form on success
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        gender: "male",
        yearCompleted: "",
        location: "",
        password: "",
        confirmPassword: "",
      });

      
    });
  };

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
      <div className="mb-6 rounded-2xl bg-[#0b4f6c] p-4 text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#f7c59f]">
          OSSA Membership
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-[0.02em]">
          Create your account
        </h2>
        <p className="mt-2 text-sm text-white/80">
          Join the science student community and stay connected with events,
          updates, and opportunities.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">
          ⚠️ {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
          ✅ {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* FIRST NAME & LAST NAME */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-xs font-black uppercase tracking-wider text-slate-950 mb-1.5"
            >
              First Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <User className="h-4 w-4" />
              </div>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                placeholder="Kwame"
                value={formData.firstName}
                onChange={handleChange}
                className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-700 transition-all placeholder:text-slate-400 focus:border-[#0b4f6c] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="block text-xs font-black uppercase tracking-wider text-slate-950 mb-1.5"
            >
              Last Name *
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              placeholder="Mensah"
              value={formData.lastName}
              onChange={handleChange}
              className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 transition-all placeholder:text-slate-400 focus:border-[#0b4f6c] focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        {/* EMAIL & PHONE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-black uppercase tracking-wider text-slate-950 mb-1.5"
            >
              Email Address *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Mail className="h-4 w-4" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="member@ousa.org"
                value={formData.email}
                onChange={handleChange}
                className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-700 transition-all placeholder:text-slate-400 focus:border-[#0b4f6c] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-xs font-black uppercase tracking-wider text-slate-950 mb-1.5"
            >
              Phone Number *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Phone className="h-4 w-4" />
              </div>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                placeholder="+233 24 000 0000"
                value={formData.phone}
                onChange={handleChange}
                className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-700 transition-all placeholder:text-slate-400 focus:border-[#0b4f6c] focus:bg-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* GENDER & YEAR COMPLETED */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="gender"
              className="block text-xs font-black uppercase tracking-wider text-slate-950 mb-1.5"
            >
              Gender *
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 transition-all focus:border-[#0b4f6c] focus:bg-white focus:outline-none"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="yearCompleted"
              className="block text-xs font-black uppercase tracking-wider text-slate-950 mb-1.5"
            >
              Year Completed *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Calendar className="h-4 w-4" />
              </div>
              <input
                id="yearCompleted"
                name="yearCompleted"
                type="number"
                required
                min="1970"
                max="2030"
                placeholder="e.g. 2022"
                value={formData.yearCompleted}
                onChange={handleChange}
                className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-700 transition-all placeholder:text-slate-400 focus:border-[#0b4f6c] focus:bg-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* LOCATION */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="location"
              className="block text-xs font-black uppercase tracking-wider text-slate-950 mb-1.5"
            >
              Location / City *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <MapPin className="h-4 w-4" />
              </div>
              <input
                id="location"
                name="location"
                type="text"
                required
                placeholder="Accra, Ghana"
                value={formData.location}
                onChange={handleChange}
                className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-700 transition-all placeholder:text-slate-400 focus:border-[#0b4f6c] focus:bg-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* PASSWORD & CONFIRM PASSWORD */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-black uppercase tracking-wider text-slate-950 mb-1.5"
            >
              Password *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Lock className="h-4 w-4" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-9 text-sm text-slate-700 transition-all placeholder:text-slate-400 focus:border-[#0b4f6c] focus:bg-white focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 transition hover:text-slate-950"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-xs font-black uppercase tracking-wider text-slate-950 mb-1.5"
            >
              Confirm Password *
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 transition-all placeholder:text-slate-400 focus:border-[#0b4f6c] focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 disabled:opacity-60"
          >
            {isPending ? (
              <span>Creating Account...</span>
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* FOOTER LINK */}
      <div className="mt-6 border-t-2 border-slate-200 pt-5 text-center">
        <p className="text-xs font-semibold text-slate-600">
          Already have an OSSA account?{" "}
          <Link
            href="/login"
            className="ml-1 font-semibold text-[#0b4f6c] underline-offset-4 transition hover:underline"
          >
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
}
