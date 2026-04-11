import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

import LayoutWrapper from "@/components/layoutWrapper";

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
      <body className="antialiased">
        <div className="min-h-dvh bg-base-100 text-base-content">
          <LayoutWrapper>{children}</LayoutWrapper>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
