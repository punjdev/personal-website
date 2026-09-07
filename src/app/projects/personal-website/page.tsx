import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import ProjectMarkdown from "@/components/ProjectMarkdown";

export const metadata: Metadata = {
  title: "devpunjabi.com",
  description:
    "How this site is built: Next.js 15, TailwindCSS v4, DaisyUI v5, deployed on Vercel.",
};

export default function PersonalWebsitePage() {
  const markdown = fs.readFileSync(
    path.join(process.cwd(), "src/content/projects/personal-website.md"),
    "utf-8"
  );

  return (
    <ProjectMarkdown breadcrumb="devpunjabi.com" markdown={markdown} />
  );
}
