# S&P 500 10-K RAG

A question-answering system over SEC 10-K filings for 94 S&P 500 companies. Ask anything about a company's risks, financials, or strategy and get an answer drawn directly from the source text, with citations pointing back to the specific section and filing year.

The system indexes two sections from each filing: Risk Factors (Item 1A) and Management's Discussion and Analysis (Item 7), producing around 11,400 chunks total. Retrieval is hybrid, combining dense vector search through Qdrant, BM25 keyword matching held in memory, and Cohere reranking to merge the two result sets. I ran a RAGAS evaluation across 30 questions comparing dense-only, BM25-only, and hybrid retrieval. Hybrid outperformed both on faithfulness and context recall.

## Two problems worth explaining

### The ticker disambiguation problem

When someone asks "What are AMD's risks..." the word "are" matches ticker ARE (Alexandria Real Estate). A proper fix might reach for a named-entity recognition model, but this project covers a fixed closed set of 94 companies. Adding a large ML dependency and an extra inference step for a problem solvable in a few lines felt unnecessary.

The solution: if any indexed company's ticker appears verbatim in the query, use it directly. Otherwise, skip tickers that are common English words. Two checks, no model.

### The table of contents trap

Microsoft's 10-K opens with a table of contents containing lines like "Item 1A. Risk Factors ... page 18". The section parser matched these entries and treated them as the actual Risk Factors section, returning 50 characters instead of 15,000.

The fix was one constant: MIN_SECTION_CHARS = 5000. Anything shorter is a table of contents entry, not real content.

## Why these services

Cohere was the right call for generation because Command R+ has native document citation support. Citations were included in the response automatically rather than being engineered through prompting.

Qdrant made hybrid search straightforward at this scale without the overhead of a managed platform. Railway was the right fit for the API because the BM25 index needs to stay loaded in memory between requests, which serverless functions cannot support cleanly.
