import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

import LayoutWrapper from "@/components/layoutWrapper";

export const metadata: Metadata = {
  metadataBase: new URL("https://devpunjabi.com"),
  title: {
    default: "Dev Punjabi Portfolio Site",
    template: "%s · Dev Punjabi",
  },
  description:
    "Software engineer in Toronto. Tech Consultant at Netlight, previously Periscope Capital & Scotiabank. I build full-stack systems for high-volume financial operations.",
  openGraph: {
    type: "website",
    url: "https://devpunjabi.com",
    siteName: "Dev Punjabi",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Applies the stored theme before first paint so there is no flash of
            the wrong theme on load. Kept in sync with THEMES in Header.tsx. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t!=="retro"&&t!=="retro-dark"){t="retro"}document.documentElement.setAttribute("data-theme",t)}catch(e){}})();`,
          }}
        />
      </head>
      <body className="antialiased">
        <div className="min-h-dvh bg-base-100 text-base-content">
          <LayoutWrapper>{children}</LayoutWrapper>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
