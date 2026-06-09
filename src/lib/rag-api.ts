const API_URL = process.env.NEXT_PUBLIC_RAG_API_URL ?? "http://localhost:8000";

export type Citation = {
  cited_text: string;
  ticker: string;
  company_name: string;
  section: "risk_factors" | "mda";
  filing_date: string;
};

export type QueryResponse = {
  answer: string;
  citations: Citation[];
  latency_ms: number;
};

export type Company = {
  ticker: string;
  company_name: string;
  filing_date: string;
};

export type CompaniesResponse = {
  companies: Company[];
  total: number;
};

export async function queryRAG(
  query: string,
  options?: { ticker?: string }
): Promise<QueryResponse> {
  const res = await fetch(`${API_URL}/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query,
      ticker: options?.ticker || undefined,
      stream: false,
    }),
  });

  if (res.status === 429) throw new Error("rate_limited");
  if (!res.ok) throw new Error(`api_error_${res.status}`);

  return res.json();
}

export async function getCompanies(): Promise<CompaniesResponse> {
  const res = await fetch(`${API_URL}/companies`);
  if (!res.ok) throw new Error(`api_error_${res.status}`);
  return res.json();
}

export function formatSection(section: string): string {
  return section === "risk_factors" ? "Risk Factors (Item 1A)" : "MD&A (Item 7)";
}

export function filingYear(filing_date: string): string {
  return filing_date.slice(0, 4);
}
