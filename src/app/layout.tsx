import type { Metadata } from "next";
import { Aladin, Quicksand, Roboto } from "next/font/google";

import "./globals.css";

import { ToastProvider } from "@/components/providers/ToastProvider";
import AppShell from "@/components/ui/AppShell";

import Providers from "./providers";

const aladin = Aladin({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-title",
});

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-body",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-small",
});

export const metadata: Metadata = {
  title: "Ossa",
  description: "Unique Ideas, Empowerment.",
  keywords: "Science, Innovation, ",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "OSSA - Old Science Students Association",
    description: "Unique Ideas, Empowerment.",
    url: "https://ossa-1.vercel.app",
    siteName: "OSSA",
    images: [
      {
        url: "https://ossa-1.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "OSSA - Old Science Students Association",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OSSA - Old Science Students Association",
    description: "Unique Ideas, Empowerment.",
    images: ["https://ossa-1.vercel.app/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`
        ${aladin.variable}
        ${quicksand.variable}
        ${roboto.variable}
        antialiased
      `}
    >
      <body
        suppressHydrationWarning
        className="flex min-h-screen flex-col bg-[#DCDCDC] text-[#000000]"
      >
        <ToastProvider>
          <AppShell>
            <Providers>{children}</Providers>
          </AppShell>
        </ToastProvider>
      </body>
    </html>
  );
}
