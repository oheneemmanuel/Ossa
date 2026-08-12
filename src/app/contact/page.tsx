import { Metadata } from "next";
import ContactContent from "@/components/ui/ContactContent";

export const metadata: Metadata = {
  title: "Contact Us | Old Science Student Association",
  description:
    "Get in touch with OSSA via WhatsApp or Email for inquiries, alumni membership, or laboratory project support.",
};

export default function ContactPage() {
  return (
    <main className="flex flex-col bg-[#f7f5ef] text-slate-900 min-h-screen">
      <ContactContent />
    </main>
  );
}