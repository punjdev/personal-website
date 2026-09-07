import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import ProjectTabs from "@/components/ProjectTabs";

export const metadata: Metadata = {
  title: "S&P 500 10-K RAG",
  description:
    "A question-answering system over SEC 10-K filings for 94 S&P 500 companies, using hybrid dense and BM25 retrieval with Cohere reranking and a RAGAS evaluation.",
};

export default function Sp500RagPage() {
  const markdown = fs.readFileSync(
    path.join(process.cwd(), "src/content/projects/sp500-rag.md"),
    "utf-8"
  );

  return <ProjectTabs breadcrumb="S&P 500 10-K RAG" markdown={markdown} />;
}
