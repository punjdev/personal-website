import type { Metadata } from "next";
import AboutMe from "@/components/AboutMe";

export const metadata: Metadata = {
  title: "About",
  description:
    "Computer Science graduate from the University of Toronto, now a Tech Consultant at Netlight. Previously built trading and automation systems at Periscope Capital and Scotiabank.",
};

export default function Home() {
  return (
   <>
    <AboutMe />
   </>
);
}
