import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

const mdComponents: Components = {
  h1: ({ children }) => (
    <h1 className="text-2xl font-bold mt-8 mb-3 text-base-content">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-lg font-semibold mt-7 mb-2 text-base-content border-b border-base-300 pb-1.5">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-base font-semibold mt-5 mb-1.5 text-base-content">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="mb-4 text-sm text-base-content/80 leading-relaxed">{children}</p>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-base-content">{children}</strong>
  ),
  ul: ({ children }) => (
    <ul className="mb-4 ml-5 space-y-1 list-disc list-outside text-sm text-base-content/80">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-4 ml-5 space-y-1 list-decimal list-outside text-sm text-base-content/80">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="leading-relaxed">{children}</li>
  ),
  code: ({ className, children }) => {
    const isBlock = !!className;
    return isBlock ? (
      <code className="text-xs font-mono text-base-content/90">{children}</code>
    ) : (
      <code className="px-1.5 py-0.5 rounded bg-base-300 text-primary text-xs font-mono">
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="bg-base-300 rounded-lg p-4 mb-5 overflow-x-auto text-xs leading-relaxed">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto mb-6">
      <table className="table table-sm w-full">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="text-xs font-medium text-base-content/60 uppercase tracking-wide">{children}</th>
  ),
  td: ({ children }) => (
    <td className="text-sm text-base-content/80">{children}</td>
  ),
  hr: () => <hr className="my-6 border-base-300" />,
  a: ({ href, children }) => (
    <a href={href} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-primary pl-4 my-4 italic text-base-content/70">
      {children}
    </blockquote>
  ),
};

type Props = {
  breadcrumb: string;
  markdown: string;
};

export default function ProjectMarkdown({ breadcrumb, markdown }: Props) {
  return (
    <div className="mx-auto max-w-4xl py-8">
      <div className="text-sm text-base-content/40 mb-6">
        <Link href="/projects" className="hover:text-base-content/70 transition-colors">
          Projects
        </Link>
        <span className="mx-2">/</span>
        <span>{breadcrumb}</span>
      </div>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
