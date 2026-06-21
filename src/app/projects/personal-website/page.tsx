import fs from "fs";
import path from "path";
import ProjectMarkdown from "@/components/ProjectMarkdown";

export default function PersonalWebsitePage() {
  const markdown = fs.readFileSync(
    path.join(process.cwd(), "src/content/projects/personal-website.md"),
    "utf-8"
  );

  return (
    <ProjectMarkdown breadcrumb="devpunjabi.com" markdown={markdown} />
  );
}
