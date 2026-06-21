import fs from "fs";
import path from "path";
import ProjectMarkdown from "@/components/ProjectMarkdown";

export default function AntibioticResistancePage() {
  const markdown = fs.readFileSync(
    path.join(process.cwd(), "src/content/projects/antibiotic-resistance.md"),
    "utf-8"
  );

  return (
    <ProjectMarkdown
      breadcrumb="Protein-Based Antibiotic Resistance Classification"
      markdown={markdown}
    />
  );
}
