import fs from "fs";
import path from "path";
import ProjectTabs from "@/components/ProjectTabs";

export default function Sp500RagPage() {
  const markdown = fs.readFileSync(
    path.join(process.cwd(), "src/content/projects/sp500-rag.md"),
    "utf-8"
  );

  return <ProjectTabs breadcrumb="S&P 500 10-K RAG" markdown={markdown} />;
}
