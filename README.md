# @pubrio/langchain-tools

LangChain tools for [Pubrio](https://pubrio.com) — the glocalized business data layer for AI agents and revenue teams. Search the whole market — not just the 30% in mainstream datasets.

Give your LangChain agents access to companies, people, jobs, news, ads, monitors, and intent signals from around the globe.

## Installation

```bash
npm install @pubrio/langchain-tools
```

## Quick Start

```typescript
import {
  PubrioCompanySearch,
  PubrioPersonSearch,
  PubrioRevealContact,
} from '@pubrio/langchain-tools';
import { ChatOpenAI } from '@langchain/openai';
import { AgentExecutor, createOpenAIFunctionsAgent } from 'langchain/agents';
import { pull } from 'langchain/hub';

const tools = [
  new PubrioCompanySearch({ apiKey: process.env.PUBRIO_API_KEY! }),
  new PubrioPersonSearch({ apiKey: process.env.PUBRIO_API_KEY! }),
  new PubrioRevealContact({ apiKey: process.env.PUBRIO_API_KEY! }),
];

const llm = new ChatOpenAI({ model: 'gpt-4' });
const prompt = await pull('hwchase17/openai-functions-agent');
const agent = await createOpenAIFunctionsAgent({ llm, tools, prompt });
const executor = new AgentExecutor({ agent, tools });

const result = await executor.invoke({
  input: 'Find SaaS companies in Singapore with 50-200 employees',
});
console.log(result.output);
```

## Available Tools (50)

### Company Tools (9)

| Tool | Description |
|------|-------------|
| `PubrioCompanySearch` | Search companies by name, domain, location, industry, technology, headcount, revenue, keywords, and 20+ filters |
| `PubrioCompanyLookup` | Look up a company by domain or LinkedIn URL |
| `PubrioCompanyEnrich` | Enrich company with full firmographic data (uses credits) |
| `PubrioCompanyLinkedInLookup` | Look up a company by its LinkedIn URL |
| `PubrioFindSimilarCompanies` | Find lookalike companies with filters for location, industry, technology, and more |
| `PubrioLookalikeLookup` | Look up lookalike company details by domain, LinkedIn URL, or domain_search_id |
| `PubrioTechnologyLookup` | Look up technologies used by a company |
| `PubrioJobSearch` | Search job postings across companies by title, location, keyword, and date |
| `PubrioJobLookup` | Look up a specific job posting by job_search_id |

### News & Ads Tools (4)

| Tool | Description |
|------|-------------|
| `PubrioNewsSearch` | Search company news and press releases by category, language, and date |
| `PubrioNewsLookup` | Look up a specific news article by news_search_id |
| `PubrioAdSearch` | Search company advertisements by search terms, headlines, locations, and dates |
| `PubrioAdLookup` | Look up a specific advertisement by advertisement_search_id |

### People Tools (7)

| Tool | Description |
|------|-------------|
| `PubrioPersonSearch` | Search people by name, title, department, seniority, location, company, and more |
| `PubrioPersonLookup` | Look up a person by LinkedIn URL or people_search_id |
| `PubrioPersonLinkedInLookup` | Real-time LinkedIn person lookup |
| `PubrioPersonEnrich` | Enrich person with full professional details (uses credits) |
| `PubrioRevealContact` | Reveal email (work/personal) or phone for a person (uses credits) |
| `PubrioBatchRedeemContacts` | Batch redeem contact information for multiple people (uses credits) |
| `PubrioQueryBatchRedeem` | Query the status of a batch redeem operation |

### Filter / Reference Data Tools (14)

| Tool | Description |
|------|-------------|
| `PubrioGetLocations` | Get the list of available locations for filtering |
| `PubrioGetDepartments` | Get the list of available department titles for filtering |
| `PubrioGetDepartmentFunctions` | Get the list of available department functions for filtering |
| `PubrioGetManagementLevels` | Get the list of available management levels for filtering |
| `PubrioGetCompanySizes` | Get the list of available company size ranges for filtering |
| `PubrioGetTimezones` | Get the list of available timezones |
| `PubrioGetNewsCategories` | Get the list of available news categories for filtering |
| `PubrioGetNewsGalleries` | Get the list of available news galleries for filtering |
| `PubrioGetNewsLanguages` | Get the list of available news languages for filtering |
| `PubrioSearchTechnologies` | Search available technologies by keyword |
| `PubrioSearchTechnologyCategories` | Search available technology categories by keyword |
| `PubrioSearchVerticals` | Search available industry verticals by keyword |
| `PubrioSearchVerticalCategories` | Search available vertical categories by keyword |
| `PubrioSearchVerticalSubCategories` | Search available vertical sub-categories by keyword |

### Monitor Tools (14)

| Tool | Description |
|------|-------------|
| `PubrioCreateMonitor` | Create a new signal monitor for jobs, news, or advertisements |
| `PubrioUpdateMonitor` | Update an existing monitor's settings |
| `PubrioGetMonitor` | Get details of a specific monitor |
| `PubrioListMonitors` | List all monitors with pagination |
| `PubrioDeleteMonitor` | Delete a monitor |
| `PubrioDuplicateMonitor` | Duplicate an existing monitor |
| `PubrioTestRunMonitor` | Test run a monitor to preview results |
| `PubrioRetryMonitor` | Retry a failed monitor execution |
| `PubrioGetMonitorStats` | Get aggregate statistics for all monitors |
| `PubrioGetMonitorLogs` | Get execution logs for a monitor |
| `PubrioGetMonitorChart` | Get chart data for a monitor over a date range |
| `PubrioGetMonitorLogDetail` | Get detailed information for a specific monitor log entry |
| `PubrioValidateWebhook` | Validate a webhook URL for use with monitors |
| `PubrioRevealMonitorSignature` | Reveal the signature of a monitor (uses credits) |

### Profile Tools (2)

| Tool | Description |
|------|-------------|
| `PubrioGetProfile` | Get the current user profile information |
| `PubrioGetUsage` | Get the current API usage statistics |

## Tool Details

### PubrioCompanySearch

Searches companies with extensive filters. Input is a JSON string:

```json
{
  "company_name": "Pubrio",
  "locations": "US,SG",
  "keywords": "ai,saas",
  "employees_min": 50,
  "employees_max": 200,
  "verticals": "software",
  "technologies": "react,python",
  "page": 1,
  "per_page": 25
}
```

### PubrioPersonSearch

Searches people with professional filters. Input is a JSON string:

```json
{
  "search_term": "VP Engineering",
  "people_titles": "VP of Engineering,Director of Engineering",
  "management_levels": "vp,director",
  "departments": "master_engineering",
  "domains": "stripe.com,notion.so",
  "people_locations": "US,GB",
  "page": 1,
  "per_page": 25
}
```

### PubrioRevealContact

Reveals contact information for a person. Input is a JSON string:

```json
{
  "people_search_id": "uuid-here",
  "people_contact_types": "email-work,phone"
}
```

Or by LinkedIn URL:

```json
{
  "linkedin_url": "https://linkedin.com/in/someone",
  "people_contact_types": "email-work,email-personal"
}
```

### PubrioCreateMonitor

Creates a signal monitor. Input is a JSON string:

```json
{
  "name": "My Job Monitor",
  "detection_mode": "new",
  "signal_types": "jobs,news",
  "destination_type": "webhook",
  "webhook_url": "https://example.com/webhook",
  "domains": "google.com,meta.com",
  "frequency_minute": 60
}
```

## Example Use Cases

- **AI sales agent**: Build an agent that researches prospects, finds decision-makers, and drafts personalized outreach
- **Lead enrichment pipeline**: Enrich CRM contacts with firmographic and professional data
- **Market research assistant**: Ask the agent to analyze companies in a sector, their hiring trends, and news coverage
- **Competitive intel bot**: Monitor competitor job postings, advertisements, and news automatically
- **Account-based workflows**: Find lookalike companies, identify key people, and reveal their contact details
- **Signal monitoring**: Set up automated monitors for job postings, news, and ads across target companies

## Authentication

Get your API key from [dashboard.pubrio.com](https://dashboard.pubrio.com) under Settings.

All tools accept the API key via constructor:

```typescript
new PubrioCompanySearch({ apiKey: 'your-api-key' })
```

Or via environment variable:

```typescript
// Set PUBRIO_API_KEY in your environment
new PubrioCompanySearch({ apiKey: process.env.PUBRIO_API_KEY! })
```

## Rate Limits

- 1,200 requests/minute global
- Plan-based hourly limits: Free (60/hr), Growth (2,400/hr), Business (12,000/hr)

## Compatibility

- Node.js >= 18
- `@langchain/core` >= 0.2.0
- Works with any LangChain-compatible LLM (OpenAI, Anthropic, Google, etc.)

## Resources

- [Pubrio API Documentation](https://docs.pubrio.com/en/api-reference/introduction)
- [Pubrio Dashboard](https://dashboard.pubrio.com)
- [LangChain.js Documentation](https://js.langchain.com)

## License

MIT
