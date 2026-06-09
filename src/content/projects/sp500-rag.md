# S&P 500 10-K RAG

A question-answering system over SEC 10-K filings. Ask anything about a company's risks or financials and get a cited answer drawn directly from the filing text. 94 companies indexed across Risk Factors (Item 1A) and MD&A (Item 7).

## Two problems worth explaining

### The ticker disambiguation problem

When a user types "What are AMD's risks…" the word *are* matches ticker **ARE** (Alexandria Real Estate). A proper fix would be a named-entity recognition model, but this project covers a fixed, closed set of 94 companies. No reason to add a 500MB ML dependency and an inference step for a problem solvable with a short blocklist.

The solution: if any indexed company's ticker appears verbatim in the query, use it directly. Otherwise, skip tickers that are common English words. Two checks, no model.

### The table of contents trap

Microsoft's filings open with a Table of Contents containing lines like *"Item 1A. Risk Factors … page 18"*. The section parser matched these TOC entries and called them the Risk Factors section — returning 50 characters instead of 15,000.

Fix was one constant: `MIN_SECTION_CHARS = 5000`. Anything shorter is a TOC entry, not real content.

## Why these services

**Cohere over OpenAI** — native document citation support in Command R+ meant citations came for free rather than being bolted on with prompt engineering.

**Qdrant** — straightforward hybrid search (dense + sparse) without the overhead of a managed platform at this scale.

**Railway** — simpler cold-start behaviour than serverless for a process that needs to hold the BM25 index in memory.
