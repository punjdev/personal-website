# S&P 500 10-K RAG

A retrieval-augmented generation (RAG) API over 100 S&P 500 companies' most recent 10-K SEC filings. Ask a natural language question; get a grounded answer with citations pointing to the exact filing sections used.

## What's indexed

- **Sections:** Item 1A (Risk Factors) and Item 7 (MD&A) per company
- **Coverage:** 100 S&P 500 companies
- **Generation:** Cohere Command R+ with native document citations
- **Retrieval:** Hybrid dense + BM25 with Cohere reranking

## API

| Environment | URL |
|-------------|-----|
| Local dev | `http://localhost:8000` |
| Production | Set `NEXT_PUBLIC_RAG_API_URL` in Vercel |

### `POST /query`

```ts
{
  query: string      // required, 1–1000 chars
  ticker?: string    // optional — restrict to one company, e.g. "AAPL"
  stream?: boolean   // false = JSON response (recommended)
}
```

**Response:**

```json
{
  "answer": "NVIDIA faces significant risks from US export controls...",
  "citations": [
    {
      "cited_text": "The U.S. government has imposed export controls...",
      "ticker": "NVDA",
      "company_name": "NVIDIA Corporation",
      "section": "risk_factors",
      "filing_date": "2025-02-25"
    }
  ],
  "latency_ms": 4800
}
```

### `GET /companies`

Returns the list of all 100 indexed companies with their tickers, names, and filing dates.

### `GET /health`

```json
{ "status": "ok", "chunk_count": 11200, "bm25_loaded": true }
```

## Design notes

**Latency is 3–8 seconds** — the retrieval + reranking + generation pipeline is not fast. A loading state is essential.

**No conversation memory.** Each `/query` call is fully independent. The API doesn't use chat history.

**Unindexed companies return a plain message, not an error.** If a company isn't in the index, `answer` is a helpful plain-text explanation and `citations` will be empty.

**`ticker` is optional but recommended.** Passing it significantly improves retrieval precision for company-specific questions.

**Streaming sends one complete event, not tokens.** `stream: true` delivers the entire answer in a single SSE event — useful only if you want to animate the response client-side after receiving it.

**Rate limit: 10 req/min per IP.** HTTP 429 on breach.

## CORS

Allowed origins: `https://devpunjabi.com`, `https://www.devpunjabi.com`, `http://localhost:3000`.
