import type { Metadata } from "next";
import ContactMe from "@/components/ContactMe";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Dev Punjabi about new opportunities, collaborations, or just to say hi.",
};

export default function Home() {
  return (
   <>
    <ContactMe />
   </>
);
}
