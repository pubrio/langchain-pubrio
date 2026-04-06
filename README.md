# @pubrio/langchain-tools

LangChain tools for [Pubrio](https://pubrio.com) — the glocalized business data layer for AI agents. Give your LangChain agents access to the whole market — companies, people, jobs, news, ads, and intent signals — not just the 30% in mainstream datasets.

## Installation

```bash
npm install @pubrio/langchain-tools
```

## Usage

```typescript
import { PubrioCompanySearch, PubrioPersonSearch } from '@pubrio/langchain-tools';
import { ChatOpenAI } from '@langchain/openai';
import { AgentExecutor, createOpenAIFunctionsAgent } from 'langchain/agents';

const tools = [
  new PubrioCompanySearch({ apiKey: process.env.PUBRIO_API_KEY! }),
  new PubrioPersonSearch({ apiKey: process.env.PUBRIO_API_KEY! }),
];

const llm = new ChatOpenAI({ model: 'gpt-4' });
// Use tools with any LangChain agent...
```

## Available Tools

| Tool | Description |
|------|-------------|
| `PubrioCompanySearch` | Search companies by name, domain, location, industry, technology, headcount |
| `PubrioCompanyLookup` | Look up a company by domain or LinkedIn URL |
| `PubrioCompanyEnrich` | Enrich company with full firmographic data (uses credits) |
| `PubrioPersonSearch` | Search people by name, title, department, seniority, company |
| `PubrioPersonLookup` | Look up a person by LinkedIn URL |
| `PubrioPersonEnrich` | Enrich person with full professional details (uses credits) |
| `PubrioRevealContact` | Reveal email or phone for a person (uses credits) |
| `PubrioJobSearch` | Search job postings across companies |
| `PubrioNewsSearch` | Search company news and press releases |
| `PubrioFindSimilarCompanies` | Find companies similar to a given company |
| `PubrioTechnologyLookup` | Look up technologies used by a company |

## Authentication

Get your API key from [dashboard.pubrio.com](https://dashboard.pubrio.com) under Settings.

## License

MIT
