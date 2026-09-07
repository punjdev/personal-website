import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import ProjectMarkdown from "@/components/ProjectMarkdown";

export const metadata: Metadata = {
  title: "Protein-Based Antibiotic Resistance Classification",
  description:
    "A ResNet-1D model that predicts antibiotic resistance class directly from protein sequences.",
};

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
