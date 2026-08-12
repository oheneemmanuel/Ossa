"use client";

import { MessageSquare, Mail, MapPin } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

const CONTACT_INFO = {
  email: "contact@ollafua19@gmail.com",
  whatsappNumber: "233544204635",
  whatsappDisplay: "+233 54 420 4635",
  location: "OSSA - Akyem Akroso",
};

export default function ContactContent() {
  const whatsappUrl = `https://wa.me/${CONTACT_INFO.whatsappNumber}?text=${encodeURIComponent(
    "Hello OSSA Team, I would like to make an inquiry regarding..."
  )}`;
  const mailtoUrl = `mailto:${CONTACT_INFO.email}?subject=${encodeURIComponent(
    "OSSA Alumni Inquiry"
  )}`;

  return (
    <div className="mx-auto max-w-4xl px-6 py-16 text-slate-950">
      {/* Header */}
      <Reveal className="text-center mb-12">
        <p className="mb-2 text-xs font-black uppercase tracking-[0.35em] text-blue-600">
          Get In Touch
        </p>
        <h1 className="text-4xl font-black uppercase tracking-tight sm:text-5xl">
          Contact <span className="text-blue-500">OSSA</span>
        </h1>
        <p className="mt-3 text-slate-600 font-medium max-w-lg mx-auto text-sm sm:text-base">
          Have questions or want to support our STEM projects? Reach out directly via WhatsApp or Email.
        </p>
      </Reveal>

      {/* Quick Action Cards */}
      <div className="grid gap-6 sm:grid-cols-2 mb-8">
        {/* WhatsApp Card */}
        <Reveal>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center text-center p-8 bg-emerald-50 rounded-2xl border-2 border-slate-950 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            <div className="mb-4 p-3 bg-emerald-600 text-white rounded-xl border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black uppercase tracking-tight mb-1">
              WhatsApp Us
            </h2>
            <p className="text-xs font-bold text-slate-600 mb-6">
              Fastest response for quick questions
            </p>
            <span className="mt-auto inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase border-2 border-slate-950">
              Message {CONTACT_INFO.whatsappDisplay}
            </span>
          </a>
        </Reveal>

        {/* Email Card */}
        <Reveal delay={100}>
          <a
            href={mailtoUrl}
            className="flex flex-col items-center text-center p-8 bg-white rounded-2xl border-2 border-slate-950 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            <div className="mb-4 p-3 bg-blue-600 text-white rounded-xl border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Mail className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black uppercase tracking-tight mb-1">
              Send Email
            </h2>
            <p className="text-xs font-bold text-slate-600 mb-6">
              For official documents & proposals
            </p>
            <span className="mt-auto inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase border-2 border-slate-950">
              {CONTACT_INFO.email}
            </span>
          </a>
        </Reveal>
      </div>

      {/* Secretariat Location Footer */}
      <Reveal delay={150}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-amber-50 rounded-2xl border-2 border-slate-950 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-bold">{CONTACT_INFO.location}</span>
          </div>
          <span className="text-[10px] font-black uppercase bg-amber-200 px-3 py-1 rounded-lg border border-slate-950 whitespace-nowrap">
            Mon - Fri: 8am - 9pm
          </span>
        </div>
      </Reveal>
    </div>
  );
}