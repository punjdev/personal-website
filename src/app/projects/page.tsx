import Link from "next/link";
import ProjectsHeading from "@/components/ProjectsHeading";

const projects = [
  {
    name: "S&P 500 10-K RAG",
    slug: "sp500-rag",
    description: "RAG API over 100 S&P 500 companies' 10-K SEC filings",
    updatedAt: "Jun 2026",
  },
];

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-4xl py-8">
      <ProjectsHeading />
      <p className="text-base-content/60 mb-10 text-sm">Things I&apos;ve built.</p>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th className="text-base-content/50 font-normal text-xs uppercase tracking-widest">
                Project
              </th>
              <th className="text-base-content/50 font-normal text-xs uppercase tracking-widest text-right">
                Last Updated
              </th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.slug} className="hover">
                <td>
                  <Link
                    href={`/projects/${p.slug}`}
                    className="block group"
                  >
                    <span className="font-medium group-hover:text-primary transition-colors">
                      {p.name}
                    </span>
                    <span className="block text-xs text-base-content/50 mt-0.5">
                      {p.description}
                    </span>
                  </Link>
                </td>
                <td className="text-right text-sm text-base-content/60 whitespace-nowrap">
                  {p.updatedAt}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
