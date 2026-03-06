import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

import Header from "../components/Header";
import Footer from "@/components/Footer";
import InteractiveMode from "@/components/InteractiveMode";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dev Punjabi Personal Website",
  description: "Portfolio Site",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-dvh bg-base-100 text-base-content">
          <div
            id="site-root"
            className="mx-auto flex min-h-dvh max-w-[1440px] flex-col px-6 sm:px-8 lg:px-12"
          >
            <Header />
            <main className="mt-4 flex-1 min-h-0">
              {children}
            </main>
            <Footer />
          </div>
        </div>
        <InteractiveMode rootId="site-root" />
        <Analytics />
      </body>
    </html>
  );
}
