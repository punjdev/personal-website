"use client";

import { usePathname } from "next/navigation";

import Footer from "./Footer";
import Header from "./Header";
import InteractiveMode from "./InteractiveMode";

type LayoutWrapperProps = {
  children: React.ReactNode;
};

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const hideChrome = pathname === "/sav";

  return (
    <>
      <div
        id="site-root"
        className={`mx-auto flex min-h-dvh flex-col ${
          hideChrome ? "w-screen max-w-none px-0" : "max-w-[1440px] px-6 sm:px-8 lg:px-12"
        }`}
      >
        {!hideChrome && <Header />}
        <main className={`${hideChrome ? "" : "mt-4"} flex-1 min-h-0`}>
          {children}
        </main>
        {!hideChrome && <Footer />}
      </div>
      {!hideChrome && <InteractiveMode rootId="site-root" />}
    </>
  );
}
