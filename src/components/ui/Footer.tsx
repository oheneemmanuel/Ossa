import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  ArrowUp,
} from "lucide-react";

const exploreLinks = [
  { name: "About", href: "/#about" },
  { name: "Events", href: "/#events" },
  { name: "Our Mission", href: "/mission" },
  { name: "Photo Gallery", href: "/gallery" },
];

const involvedLinks = [
  { name: "Register Membership", href: "/register" },
  { name: "Member Sign In", href: "/login" },
  { name: "Contact Us", href: "/contact" },
];

// TODO: replace every placeholder below with your real details
const contact = {
  email: "ollafua19@gmail.com",
  phone: "+233544204635",
  location: "Accra, Ghana",
};



const linkClass =
  "flex min-h-[44px] items-center text-sm font-semibold text-white/90 transition hover:text-[#f7c59f]";

export default function Footer() {
  return (
    <footer className="mt-auto border-t-2 border-slate-950 bg-[#0b4f6c] text-white">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#f7c59f]">
            OSSA
          </p>
          <p className="mt-2 text-sm leading-relaxed text-white/80">
            Old Science Student Association. Building school laboratories,
            funding STEM resources and keeping a lifelong network of science
            graduates.
          </p>
         
        </div>

        {/* Explore */}
        <nav aria-label="Explore">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#f7c59f]">
            Explore
          </p>
          <ul className="mt-2">
            {exploreLinks.map((link) => (
              <li key={link.name}>
                <Link href={link.href} className={linkClass}>
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Get involved */}
        <nav aria-label="Get involved">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#f7c59f]">
            Get Involved
          </p>
          <ul className="mt-2">
            {involvedLinks.map((link) => (
              <li key={link.name}>
                <Link href={link.href} className={linkClass}>
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact */}
        <div>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#f7c59f]">
            Contact
          </p>
          <ul className="mt-2">
            <li>
              <a
                href={`mailto:${contact.email}`}
                className={`${linkClass} gap-3`}
              >
                <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                {contact.email}
              </a>
            </li>
            <li>
              <a
                href={`tel:${contact.phone.replace(/\s/g, "")}`}
                className={`${linkClass} gap-3`}
              >
                <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                {contact.phone}
              </a>
            </li>
            <li className="flex min-h-[44px] items-center gap-3 text-sm font-semibold text-white/90">
              <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
              {contact.location}
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/20">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-6 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-white/80">
            © {new Date().getFullYear()} Old Science Student Association. All
            rights reserved.
          </p>
          <div className="flex flex-wrap items-center sm:gap-2">
            <Link href="/privacy" className={`${linkClass} pr-4`}>
              Privacy
            </Link>
            <Link href="/terms" className={`${linkClass} pr-4`}>
              Terms
            </Link>
            <a href="#top" className={`${linkClass} gap-2`}>
              Back to top
              <ArrowUp className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
