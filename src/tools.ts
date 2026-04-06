import { Tool } from '@langchain/core/tools';
import { type PubrioConfig, pubrioRequest } from './base.js';

function parseInput(input: string): Record<string, unknown> {
	try {
		return JSON.parse(input);
	} catch {
		return { query: input };
	}
}

function splitComma(value: unknown): string[] | undefined {
	if (!value || typeof value !== 'string') return undefined;
	return value
		.split(',')
		.map((s) => s.trim())
		.filter(Boolean);
}

export class PubrioCompanySearch extends Tool {
	name = 'pubrio_search_companies';
	description =
		'Search B2B companies by name, domain, location, industry, technology, or headcount. Input: JSON with optional fields: company_name, companies (comma-separated), domains (comma-separated), linkedin_urls (comma-separated), locations (comma-separated), exclude_locations (comma-separated), places (comma-separated), exclude_places (comma-separated), job_locations (comma-separated), job_exclude_locations (comma-separated), job_posted_dates (comma-separated), job_titles (comma-separated), verticals (comma-separated), vertical_categories (comma-separated), vertical_sub_categories (comma-separated), categories (comma-separated), technologies (comma-separated), keywords (comma-separated), news_categories (comma-separated), news_published_dates (comma-separated), advertisement_search_terms (comma-separated), advertisement_target_locations (comma-separated), advertisement_exclude_target_locations (comma-separated), advertisement_start_dates (comma-separated), advertisement_end_dates (comma-separated), employees_min, employees_max, revenues_min, revenues_max, founded_dates_min, founded_dates_max, filter_conditions, is_enable_similarity_search, similarity_score, exclude_fields (comma-separated), page, per_page.';
	private apiKey: string;

	constructor(config: PubrioConfig) {
		super();
		this.apiKey = config.apiKey;
	}

	async _call(input: string): Promise<string> {
		const params = parseInput(input);
		const body: Record<string, unknown> = {
			page: params.page ?? 1,
			per_page: params.per_page ?? 25,
		};
		if (params.company_name) body.company_name = params.company_name;
		if (params.companies) body.companies = splitComma(params.companies);
		if (params.domains) body.domains = splitComma(params.domains);
		if (params.linkedin_urls) body.linkedin_urls = splitComma(params.linkedin_urls);
		if (params.locations) body.locations = splitComma(params.locations);
		if (params.exclude_locations) body.exclude_locations = splitComma(params.exclude_locations);
		if (params.places) body.places = splitComma(params.places);
		if (params.exclude_places) body.exclude_places = splitComma(params.exclude_places);
		if (params.job_locations) body.job_locations = splitComma(params.job_locations);
		if (params.job_exclude_locations)
			body.job_exclude_locations = splitComma(params.job_exclude_locations);
		if (params.job_posted_dates) body.job_posted_dates = splitComma(params.job_posted_dates);
		if (params.job_titles) body.job_titles = splitComma(params.job_titles);
		if (params.verticals) body.verticals = splitComma(params.verticals);
		if (params.vertical_categories)
			body.vertical_categories = splitComma(params.vertical_categories);
		if (params.vertical_sub_categories)
			body.vertical_sub_categories = splitComma(params.vertical_sub_categories);
		if (params.categories) body.categories = splitComma(params.categories);
		if (params.technologies) body.technologies = splitComma(params.technologies);
		if (params.keywords) body.keywords = splitComma(params.keywords);
		if (params.news_categories) body.news_categories = splitComma(params.news_categories);
		if (params.news_published_dates)
			body.news_published_dates = splitComma(params.news_published_dates);
		if (params.advertisement_search_terms)
			body.advertisement_search_terms = splitComma(params.advertisement_search_terms);
		if (params.advertisement_target_locations)
			body.advertisement_target_locations = splitComma(params.advertisement_target_locations);
		if (params.advertisement_exclude_target_locations)
			body.advertisement_exclude_target_locations = splitComma(
				params.advertisement_exclude_target_locations,
			);
		if (params.advertisement_start_dates)
			body.advertisement_start_dates = splitComma(params.advertisement_start_dates);
		if (params.advertisement_end_dates)
			body.advertisement_end_dates = splitComma(params.advertisement_end_dates);
		if (params.employees_min != null || params.employees_max != null) {
			body.employees = [params.employees_min ?? 1, params.employees_max ?? 1000000];
		}
		if (params.revenues_min != null || params.revenues_max != null) {
			body.revenues = [params.revenues_min ?? 0, params.revenues_max ?? 100000000000];
		}
		if (params.founded_dates_min != null || params.founded_dates_max != null) {
			body.founded_dates = [params.founded_dates_min ?? 1900, params.founded_dates_max ?? 2030];
		}
		if (params.filter_conditions) body.filter_conditions = params.filter_conditions;
		if (params.is_enable_similarity_search != null)
			body.is_enable_similarity_search = params.is_enable_similarity_search;
		if (params.similarity_score != null) body.similarity_score = params.similarity_score;
		if (params.exclude_fields) body.exclude_fields = splitComma(params.exclude_fields);
		const result = await pubrioRequest(this.apiKey, 'POST', '/companies/search', body);
		return JSON.stringify(result);
	}
}

export class PubrioCompanyLookup extends Tool {
	name = 'pubrio_lookup_company';
	description =
		'Look up detailed company information by domain or LinkedIn URL. Input: JSON with domain (e.g. "google.com") or linkedin_url.';
	private apiKey: string;

	constructor(config: PubrioConfig) {
		super();
		this.apiKey = config.apiKey;
	}

	async _call(input: string): Promise<string> {
		const params = parseInput(input);
		const body: Record<string, unknown> = {};
		if (params.domain) body.domain = params.domain;
		else if (params.linkedin_url) body.linkedin_url = params.linkedin_url;
		else body.domain = params.query;
		const result = await pubrioRequest(this.apiKey, 'POST', '/companies/lookup', body);
		return JSON.stringify(result);
	}
}

export class PubrioCompanyEnrich extends Tool {
	name = 'pubrio_enrich_company';
	description =
		'Enrich company data with full firmographic details including revenue, headcount, technologies, and more. Uses credits. Input: JSON with domain or linkedin_url.';
	private apiKey: string;

	constructor(config: PubrioConfig) {
		super();
		this.apiKey = config.apiKey;
	}

	async _call(input: string): Promise<string> {
		const params = parseInput(input);
		const body: Record<string, unknown> = {};
		if (params.domain) body.domain = params.domain;
		else if (params.linkedin_url) body.linkedin_url = params.linkedin_url;
		else body.domain = params.query;
		const result = await pubrioRequest(this.apiKey, 'POST', '/companies/lookup/enrich', body);
		return JSON.stringify(result);
	}
}

export class PubrioPersonSearch extends Tool {
	name = 'pubrio_search_people';
	description =
		'Search business professionals by name, title, department, seniority level, or company domain. Input: JSON with optional fields: search_term, people_name, people_titles (comma-separated), peoples (comma-separated), management_levels (comma-separated), departments (comma-separated), department_functions (comma-separated), employees_min, employees_max, people_locations (comma-separated), company_locations (comma-separated), company_linkedin_urls (comma-separated), linkedin_urls (comma-separated), companies (comma-separated), domains (comma-separated), page, per_page.';
	private apiKey: string;

	constructor(config: PubrioConfig) {
		super();
		this.apiKey = config.apiKey;
	}

	async _call(input: string): Promise<string> {
		const params = parseInput(input);
		const body: Record<string, unknown> = {
			page: params.page ?? 1,
			per_page: params.per_page ?? 25,
		};
		if (params.search_term) body.search_term = params.search_term;
		if (params.people_name) body.people_name = params.people_name;
		if (params.people_titles) body.people_titles = splitComma(params.people_titles);
		if (params.peoples) body.peoples = splitComma(params.peoples);
		if (params.management_levels) body.management_levels = splitComma(params.management_levels);
		if (params.departments) body.departments = splitComma(params.departments);
		if (params.department_functions)
			body.department_functions = splitComma(params.department_functions);
		if (params.employees_min != null || params.employees_max != null) {
			body.employees = [params.employees_min ?? 1, params.employees_max ?? 1000000];
		}
		if (params.people_locations) body.people_locations = splitComma(params.people_locations);
		if (params.company_locations) body.company_locations = splitComma(params.company_locations);
		if (params.company_linkedin_urls)
			body.company_linkedin_urls = splitComma(params.company_linkedin_urls);
		if (params.linkedin_urls) body.linkedin_urls = splitComma(params.linkedin_urls);
		if (params.companies) body.companies = splitComma(params.companies);
		if (params.domains) body.domains = splitComma(params.domains);
		const result = await pubrioRequest(this.apiKey, 'POST', '/people/search', body);
		return JSON.stringify(result);
	}
}

export class PubrioPersonLookup extends Tool {
	name = 'pubrio_lookup_person';
	description =
		"Look up a person's professional profile by LinkedIn URL or Pubrio people_search_id. Input: JSON with linkedin_url or people_search_id.";
	private apiKey: string;

	constructor(config: PubrioConfig) {
		super();
		this.apiKey = config.apiKey;
	}

	async _call(input: string): Promise<string> {
		const params = parseInput(input);
		const body: Record<string, unknown> = {};
		if (params.people_search_id) body.people_search_id = params.people_search_id;
		else if (params.linkedin_url) body.linkedin_url = params.linkedin_url;
		else body.linkedin_url = params.query;
		const result = await pubrioRequest(this.apiKey, 'POST', '/people/lookup', body);
		return JSON.stringify(result);
	}
}

export class PubrioPersonEnrich extends Tool {
	name = 'pubrio_enrich_person';
	description =
		'Enrich person data with full professional details including employment history, skills, and education. Uses credits. Input: JSON with linkedin_url or people_search_id.';
	private apiKey: string;

	constructor(config: PubrioConfig) {
		super();
		this.apiKey = config.apiKey;
	}

	async _call(input: string): Promise<string> {
		const params = parseInput(input);
		const body: Record<string, unknown> = {};
		if (params.linkedin_url) body.linkedin_url = params.linkedin_url;
		else if (params.people_search_id) body.people_search_id = params.people_search_id;
		else body.linkedin_url = params.query;
		const result = await pubrioRequest(this.apiKey, 'POST', '/people/enrichment', body);
		return JSON.stringify(result);
	}
}

export class PubrioPersonLinkedInLookup extends Tool {
	name = 'pubrio_lookup_person_linkedin';
	description =
		'Look up a person by their LinkedIn profile URL. Input: JSON with people_linkedin_url (the full LinkedIn profile URL).';
	private apiKey: string;

	constructor(config: PubrioConfig) {
		super();
		this.apiKey = config.apiKey;
	}

	async _call(input: string): Promise<string> {
		const params = parseInput(input);
		const body: Record<string, unknown> = {
			people_linkedin_url: params.people_linkedin_url ?? params.query,
		};
		const result = await pubrioRequest(this.apiKey, 'POST', '/people/linkedin/lookup', body);
		return JSON.stringify(result);
	}
}

export class PubrioRevealContact extends Tool {
	name = 'pubrio_reveal_contact';
	description =
		'Reveal email or phone number for a person. Uses credits. Input: JSON with people_search_id or linkedin_url, and optional people_contact_types array (values: "email-personal", "email-work", "phone").';
	private apiKey: string;

	constructor(config: PubrioConfig) {
		super();
		this.apiKey = config.apiKey;
	}

	async _call(input: string): Promise<string> {
		const params = parseInput(input);
		const body: Record<string, unknown> = {};
		if (params.people_search_id) body.people_search_id = params.people_search_id;
		else if (params.linkedin_url) body.linkedin_url = params.linkedin_url;
		else body.people_search_id = params.query;
		if (params.people_contact_types) body.people_contact_types = params.people_contact_types;
		const result = await pubrioRequest(this.apiKey, 'POST', '/redeem/people', body);
		return JSON.stringify(result);
	}
}

export class PubrioJobSearch extends Tool {
	name = 'pubrio_search_jobs';
	description =
		'Search job postings across companies. Input: JSON with optional fields: search_term, search_terms (comma-separated), titles (comma-separated), posted_dates (comma-separated), locations (comma-separated), exclude_locations (comma-separated), company_locations (comma-separated), companies (comma-separated), domains (comma-separated), linkedin_urls (comma-separated), page, per_page.';
	private apiKey: string;

	constructor(config: PubrioConfig) {
		super();
		this.apiKey = config.apiKey;
	}

	async _call(input: string): Promise<string> {
		const params = parseInput(input);
		const body: Record<string, unknown> = {
			page: params.page ?? 1,
			per_page: params.per_page ?? 25,
		};
		if (params.search_term) body.search_term = params.search_term;
		if (params.search_terms) body.search_terms = splitComma(params.search_terms);
		if (params.titles) body.titles = splitComma(params.titles);
		if (params.posted_dates) body.posted_dates = splitComma(params.posted_dates);
		if (params.locations) body.locations = splitComma(params.locations);
		if (params.exclude_locations) body.exclude_locations = splitComma(params.exclude_locations);
		if (params.company_locations) body.company_locations = splitComma(params.company_locations);
		if (params.companies) body.companies = splitComma(params.companies);
		if (params.domains) body.domains = splitComma(params.domains);
		if (params.linkedin_urls) body.linkedin_urls = splitComma(params.linkedin_urls);
		const result = await pubrioRequest(this.apiKey, 'POST', '/companies/jobs/search', body);
		return JSON.stringify(result);
	}
}

export class PubrioNewsSearch extends Tool {
	name = 'pubrio_search_news';
	description =
		'Search company news and press releases. Input: JSON with optional fields: search_term, search_terms (comma-separated), categories (comma-separated), published_dates (comma-separated), locations (comma-separated), company_locations (comma-separated), companies (comma-separated), domains (comma-separated), linkedin_urls (comma-separated), news_gallery_ids (comma-separated), news_galleries (comma-separated), news_languages (comma-separated), page, per_page.';
	private apiKey: string;

	constructor(config: PubrioConfig) {
		super();
		this.apiKey = config.apiKey;
	}

	async _call(input: string): Promise<string> {
		const params = parseInput(input);
		const body: Record<string, unknown> = {
			page: params.page ?? 1,
			per_page: params.per_page ?? 25,
		};
		if (params.search_term) body.search_term = params.search_term;
		if (params.search_terms) body.search_terms = splitComma(params.search_terms);
		if (params.categories) body.categories = splitComma(params.categories);
		if (params.published_dates) body.published_dates = splitComma(params.published_dates);
		if (params.locations) body.locations = splitComma(params.locations);
		if (params.company_locations) body.company_locations = splitComma(params.company_locations);
		if (params.companies) body.companies = splitComma(params.companies);
		if (params.domains) body.domains = splitComma(params.domains);
		if (params.linkedin_urls) body.linkedin_urls = splitComma(params.linkedin_urls);
		if (params.news_gallery_ids) body.news_gallery_ids = splitComma(params.news_gallery_ids);
		if (params.news_galleries) body.news_galleries = splitComma(params.news_galleries);
		if (params.news_languages) body.news_languages = splitComma(params.news_languages);
		const result = await pubrioRequest(this.apiKey, 'POST', '/companies/news/search', body);
		return JSON.stringify(result);
	}
}

export class PubrioFindSimilarCompanies extends Tool {
	name = 'pubrio_find_similar_companies';
	description =
		'Find companies similar to a given company. Input: JSON with one of: domain_search_id, domain (e.g. "google.com"), or linkedin_url, plus optional page and per_page.';
	private apiKey: string;

	constructor(config: PubrioConfig) {
		super();
		this.apiKey = config.apiKey;
	}

	async _call(input: string): Promise<string> {
		const params = parseInput(input);
		const body: Record<string, unknown> = {
			page: params.page ?? 1,
			per_page: params.per_page ?? 25,
		};
		if (params.domain_search_id) body.domain_search_id = params.domain_search_id;
		else if (params.domain) body.domain = params.domain;
		else if (params.linkedin_url) body.linkedin_url = params.linkedin_url;
		else body.domain = params.query;
		const result = await pubrioRequest(
			this.apiKey,
			'POST',
			'/companies/lookalikes/search',
			body,
		);
		return JSON.stringify(result);
	}
}

export class PubrioTechnologyLookup extends Tool {
	name = 'pubrio_lookup_technology';
	description =
		'Look up technologies used by a company. Input: JSON with one of: domain_search_id, domain (e.g. "google.com"), linkedin_url, or domain_id (integer).';
	private apiKey: string;

	constructor(config: PubrioConfig) {
		super();
		this.apiKey = config.apiKey;
	}

	async _call(input: string): Promise<string> {
		const params = parseInput(input);
		const body: Record<string, unknown> = {};
		if (params.domain_search_id) body.domain_search_id = params.domain_search_id;
		else if (params.domain) body.domain = params.domain;
		else if (params.linkedin_url) body.linkedin_url = params.linkedin_url;
		else if (params.domain_id != null) body.domain_id = params.domain_id;
		else body.domain = params.query;
		const result = await pubrioRequest(this.apiKey, 'POST', '/technologies/lookup', body);
		return JSON.stringify(result);
	}
}

// ---------------------------------------------------------------------------
// Company (additional)
// ---------------------------------------------------------------------------

export class PubrioCompanyLinkedInLookup extends Tool {
	name = 'pubrio_lookup_company_linkedin';
	description =
		'Look up a company by its LinkedIn URL. Input: JSON with linkedin_url (required).';
	private apiKey: string;

	constructor(config: PubrioConfig) {
		super();
		this.apiKey = config.apiKey;
	}

	async _call(input: string): Promise<string> {
		const params = parseInput(input);
		const body: Record<string, unknown> = {
			linkedin_url: params.linkedin_url ?? params.query,
		};
		const result = await pubrioRequest(this.apiKey, 'POST', '/companies/linkedin/lookup', body);
		return JSON.stringify(result);
	}
}

export class PubrioJobLookup extends Tool {
	name = 'pubrio_lookup_job';
	description =
		'Look up a specific job posting by its job_search_id. Input: JSON with job_search_id (required).';
	private apiKey: string;

	constructor(config: PubrioConfig) {
		super();
		this.apiKey = config.apiKey;
	}

	async _call(input: string): Promise<string> {
		const params = parseInput(input);
		const body: Record<string, unknown> = {
			job_search_id: params.job_search_id ?? params.query,
		};
		const result = await pubrioRequest(this.apiKey, 'POST', '/companies/jobs/lookup', body);
		return JSON.stringify(result);
	}
}

export class PubrioNewsLookup extends Tool {
	name = 'pubrio_lookup_news';
	description =
		'Look up a specific news article by its news_search_id. Input: JSON with news_search_id (required).';
	private apiKey: string;

	constructor(config: PubrioConfig) {
		super();
		this.apiKey = config.apiKey;
	}

	async _call(input: string): Promise<string> {
		const params = parseInput(input);
		const body: Record<string, unknown> = {
			news_search_id: params.news_search_id ?? params.query,
		};
		const result = await pubrioRequest(this.apiKey, 'POST', '/companies/news/lookup', body);
		return JSON.stringify(result);
	}
}

export class PubrioAdSearch extends Tool {
	name = 'pubrio_search_ads';
	description =
		'Search company advertisements. Input: JSON with optional fields: search_terms (comma-separated), headlines (comma-separated), target_locations (comma-separated), exclude_target_locations (comma-separated), start_dates (comma-separated), end_dates (comma-separated), company_locations (comma-separated), companies (comma-separated), domains (comma-separated), linkedin_urls (comma-separated), filter_conditions, page, per_page.';
	private apiKey: string;

	constructor(config: PubrioConfig) {
		super();
		this.apiKey = config.apiKey;
	}

	async _call(input: string): Promise<string> {
		const params = parseInput(input);
		const body: Record<string, unknown> = {
			page: params.page ?? 1,
			per_page: params.per_page ?? 25,
		};
		if (params.search_terms) body.search_terms = splitComma(params.search_terms);
		if (params.headlines) body.headlines = splitComma(params.headlines);
		if (params.target_locations) body.target_locations = splitComma(params.target_locations);
		if (params.exclude_target_locations)
			body.exclude_target_locations = splitComma(params.exclude_target_locations);
		if (params.start_dates) body.start_dates = splitComma(params.start_dates);
		if (params.end_dates) body.end_dates = splitComma(params.end_dates);
		if (params.company_locations) body.company_locations = splitComma(params.company_locations);
		if (params.companies) body.companies = splitComma(params.companies);
		if (params.domains) body.domains = splitComma(params.domains);
		if (params.linkedin_urls) body.linkedin_urls = splitComma(params.linkedin_urls);
		if (params.filter_conditions) body.filter_conditions = params.filter_conditions;
		const result = await pubrioRequest(
			this.apiKey,
			'POST',
			'/companies/advertisements/search',
			body,
		);
		return JSON.stringify(result);
	}
}

export class PubrioAdLookup extends Tool {
	name = 'pubrio_lookup_advertisement';
	description =
		'Look up a specific advertisement by its advertisement_search_id. Input: JSON with advertisement_search_id (required).';
	private apiKey: string;

	constructor(config: PubrioConfig) {
		super();
		this.apiKey = config.apiKey;
	}

	async _call(input: string): Promise<string> {
		const params = parseInput(input);
		const body: Record<string, unknown> = {
			advertisement_search_id: params.advertisement_search_id ?? params.query,
		};
		const result = await pubrioRequest(
			this.apiKey,
			'POST',
			'/companies/advertisements/lookup',
			body,
		);
		return JSON.stringify(result);
	}
}

export class PubrioLookalikeLookup extends Tool {
	name = 'pubrio_lookup_lookalike';
	description =
		'Look up lookalike company details. Input: JSON with optional domain, linkedin_url, or domain_search_id.';
	private apiKey: string;

	constructor(config: PubrioConfig) {
		super();
		this.apiKey = config.apiKey;
	}

	async _call(input: string): Promise<string> {
		const params = parseInput(input);
		const body: Record<string, unknown> = {};
		if (params.domain) body.domain = params.domain;
		if (params.linkedin_url) body.linkedin_url = params.linkedin_url;
		if (params.domain_search_id) body.domain_search_id = params.domain_search_id;
		if (Object.keys(body).length === 0) body.domain = params.query;
		const result = await pubrioRequest(
			this.apiKey,
			'POST',
			'/companies/lookalikes/lookup',
			body,
		);
		return JSON.stringify(result);
	}
}

// ---------------------------------------------------------------------------
// People (additional)
// ---------------------------------------------------------------------------

export class PubrioBatchRedeemContacts extends Tool {
	name = 'pubrio_batch_redeem_contacts';
	description =
		'Batch redeem contact information for multiple people. Uses credits. Input: JSON with peoples (required, comma-separated people_search_ids) and optional people_contact_types (comma-separated: email-personal, email-work, phone).';
	private apiKey: string;

	constructor(config: PubrioConfig) {
		super();
		this.apiKey = config.apiKey;
	}

	async _call(input: string): Promise<string> {
		const params = parseInput(input);
		const body: Record<string, unknown> = {
			peoples: splitComma(params.peoples ?? params.query),
		};
		if (params.people_contact_types)
			body.people_contact_types = splitComma(params.people_contact_types);
		const result = await pubrioRequest(this.apiKey, 'POST', '/redeem/people/batch', body);
		return JSON.stringify(result);
	}
}

export class PubrioQueryBatchRedeem extends Tool {
	name = 'pubrio_query_batch_redeem';
	description =
		'Query the status of a batch redeem operation. Input: JSON with redeem_query_id (required).';
	private apiKey: string;

	constructor(config: PubrioConfig) {
		super();
		this.apiKey = config.apiKey;
	}

	async _call(input: string): Promise<string> {
		const params = parseInput(input);
		const body: Record<string, unknown> = {
			redeem_query_id: params.redeem_query_id ?? params.query,
		};
		const result = await pubrioRequest(this.apiKey, 'POST', '/redeem/people/batch/query', body);
		return JSON.stringify(result);
	}
}

// ---------------------------------------------------------------------------
// Filter / Reference Data
// ---------------------------------------------------------------------------

export class PubrioGetLocations extends Tool {
	name = 'pubrio_get_locations';
	description = 'Get the list of available locations for filtering. No input required.';
	private apiKey: string;

	constructor(config: PubrioConfig) {
		super();
		this.apiKey = config.apiKey;
	}

	async _call(_input: string): Promise<string> {
		const result = await pubrioRequest(this.apiKey, 'GET', '/locations');
		return JSON.stringify(result);
	}
}

export class PubrioGetDepartments extends Tool {
	name = 'pubrio_get_departments';
	description = 'Get the list of available department titles for filtering. No input required.';
	private apiKey: string;

	constructor(config: PubrioConfig) {
		super();
		this.apiKey = config.apiKey;
	}

	async _call(_input: string): Promise<string> {
		const result = await pubrioRequest(this.apiKey, 'GET', '/departments/title');
		return JSON.stringify(result);
	}
}

export class PubrioGetDepartmentFunctions extends Tool {
	name = 'pubrio_get_department_functions';
	description =
		'Get the list of available department functions for filtering. No input required.';
	private apiKey: string;

	constructor(config: PubrioConfig) {
		super();
		this.apiKey = config.apiKey;
	}

	async _call(_input: string): Promise<string> {
		const result = await pubrioRequest(this.apiKey, 'GET', '/departments/function');
		return JSON.stringify(result);
	}
}

export class PubrioGetManagementLevels extends Tool {
	name = 'pubrio_get_management_levels';
	description = 'Get the list of available management levels for filtering. No input required.';
	private apiKey: string;

	constructor(config: PubrioConfig) {
		super();
		this.apiKey = config.apiKey;
	}

	async _call(_input: string): Promise<string> {
		const result = await pubrioRequest(this.apiKey, 'GET', '/management_levels');
		return JSON.stringify(result);
	}
}

export class PubrioGetCompanySizes extends Tool {
	name = 'pubrio_get_company_sizes';
	description = 'Get the list of available company size ranges for filtering. No input required.';
	private apiKey: string;

	constructor(config: PubrioConfig) {
		super();
		this.apiKey = config.apiKey;
	}

	async _call(_input: string): Promise<string> {
		const result = await pubrioRequest(this.apiKey, 'GET', '/company_sizes');
		return JSON.stringify(result);
	}
}

export class PubrioGetTimezones extends Tool {
	name = 'pubrio_get_timezones';
	description = 'Get the list of available timezones. No input required.';
	private apiKey: string;

	constructor(config: PubrioConfig) {
		super();
		this.apiKey = config.apiKey;
	}

	async _call(_input: string): Promise<string> {
		const result = await pubrioRequest(this.apiKey, 'GET', '/timezones');
		return JSON.stringify(result);
	}
}

export class PubrioGetNewsCategories extends Tool {
	name = 'pubrio_get_news_categories';
	description = 'Get the list of available news categories for filtering. No input required.';
	private apiKey: string;

	constructor(config: PubrioConfig) {
		super();
		this.apiKey = config.apiKey;
	}

	async _call(_input: string): Promise<string> {
		const result = await pubrioRequest(this.apiKey, 'GET', '/companies/news/categories');
		return JSON.stringify(result);
	}
}

export class PubrioGetNewsGalleries extends Tool {
	name = 'pubrio_get_news_galleries';
	description = 'Get the list of available news galleries for filtering. No input required.';
	private apiKey: string;

	constructor(config: PubrioConfig) {
		super();
		this.apiKey = config.apiKey;
	}

	async _call(_input: string): Promise<string> {
		const result = await pubrioRequest(this.apiKey, 'GET', '/companies/news/galleries');
		return JSON.stringify(result);
	}
}

export class PubrioGetNewsLanguages extends Tool {
	name = 'pubrio_get_news_languages';
	description = 'Get the list of available news languages for filtering. No input required.';
	private apiKey: string;

	constructor(config: PubrioConfig) {
		super();
		this.apiKey = config.apiKey;
	}

	async _call(_input: string): Promise<string> {
		const result = await pubrioRequest(this.apiKey, 'GET', '/companies/news/languages');
		return JSON.stringify(result);
	}
}

export class PubrioSearchTechnologies extends Tool {
	name = 'pubrio_search_technologies';
	description =
		'Search available technologies by keyword. Input: JSON with optional keyword (string).';
	private apiKey: string;

	constructor(config: PubrioConfig) {
		super();
		this.apiKey = config.apiKey;
	}

	async _call(input: string): Promise<string> {
		const params = parseInput(input);
		const body: Record<string, unknown> = {};
		if (params.keyword) body.keyword = params.keyword;
		else if (params.query && params.query !== input) body.keyword = params.query;
		const result = await pubrioRequest(this.apiKey, 'POST', '/technologies', body);
		return JSON.stringify(result);
	}
}

export class PubrioSearchTechnologyCategories extends Tool {
	name = 'pubrio_search_technology_categories';
	description =
		'Search available technology categories by keyword. Input: JSON with optional keyword (string).';
	private apiKey: string;

	constructor(config: PubrioConfig) {
		super();
		this.apiKey = config.apiKey;
	}

	async _call(input: string): Promise<string> {
		const params = parseInput(input);
		const body: Record<string, unknown> = {};
		if (params.keyword) body.keyword = params.keyword;
		else if (params.query && params.query !== input) body.keyword = params.query;
		const result = await pubrioRequest(this.apiKey, 'POST', '/technologies/categories', body);
		return JSON.stringify(result);
	}
}

export class PubrioSearchVerticals extends Tool {
	name = 'pubrio_search_verticals';
	description =
		'Search available industry verticals by keyword. Input: JSON with optional keyword (string).';
	private apiKey: string;

	constructor(config: PubrioConfig) {
		super();
		this.apiKey = config.apiKey;
	}

	async _call(input: string): Promise<string> {
		const params = parseInput(input);
		const body: Record<string, unknown> = {};
		if (params.keyword) body.keyword = params.keyword;
		else if (params.query && params.query !== input) body.keyword = params.query;
		const result = await pubrioRequest(this.apiKey, 'POST', '/verticals', body);
		return JSON.stringify(result);
	}
}

export class PubrioSearchVerticalCategories extends Tool {
	name = 'pubrio_search_vertical_categories';
	description =
		'Search available vertical categories by keyword. Input: JSON with optional keyword (string).';
	private apiKey: string;

	constructor(config: PubrioConfig) {
		super();
		this.apiKey = config.apiKey;
	}

	async _call(input: string): Promise<string> {
		const params = parseInput(input);
		const body: Record<string, unknown> = {};
		if (params.keyword) body.keyword = params.keyword;
		else if (params.query && params.query !== input) body.keyword = params.query;
		const result = await pubrioRequest(this.apiKey, 'POST', '/verticals/categories', body);
		return JSON.stringify(result);
	}
}

export class PubrioSearchVerticalSubCategories extends Tool {
	name = 'pubrio_search_vertical_sub_categories';
	description =
		'Search available vertical sub-categories by keyword. Input: JSON with optional keyword (string).';
	private apiKey: string;

	constructor(config: PubrioConfig) {
		super();
		this.apiKey = config.apiKey;
	}

	async _call(input: string): Promise<string> {
		const params = parseInput(input);
		const body: Record<string, unknown> = {};
		if (params.keyword) body.keyword = params.keyword;
		else if (params.query && params.query !== input) body.keyword = params.query;
		const result = await pubrioRequest(this.apiKey, 'POST', '/verticals/sub_categories', body);
		return JSON.stringify(result);
	}
}

// ---------------------------------------------------------------------------
// Monitor
// ---------------------------------------------------------------------------

export class PubrioCreateMonitor extends Tool {
	name = 'pubrio_create_monitor';
	description =
		'Create a new signal monitor. Input: JSON with name (required), detection_mode (required - "new" or "new_and_updated"), signal_types (required, comma-separated: jobs, news, advertisements), destination_type (required - "webhook", "email", or "outreach_sequence"), and optional webhook_url, email, sequence_identifier, description, frequency_minute, max_daily_trigger, max_records_per_trigger, companies (comma-separated UUIDs), domains (comma-separated), linkedin_urls (comma-separated).';
	private apiKey: string;

	constructor(config: PubrioConfig) {
		super();
		this.apiKey = config.apiKey;
	}

	async _call(input: string): Promise<string> {
		const params = parseInput(input);
		const body: Record<string, unknown> = {
			name: params.name,
			detection_mode: params.detection_mode,
			signal_types: splitComma(params.signal_types),
			destination_type: params.destination_type,
		};
		if (params.webhook_url) body.webhook_url = params.webhook_url;
		if (params.email) body.email = params.email;
		if (params.sequence_identifier) body.sequence_identifier = params.sequence_identifier;
		if (params.description) body.description = params.description;
		if (params.frequency_minute != null) body.frequency_minute = params.frequency_minute;
		if (params.max_daily_trigger != null) body.max_daily_trigger = params.max_daily_trigger;
		if (params.max_records_per_trigger != null)
			body.max_records_per_trigger = params.max_records_per_trigger;
		if (params.companies) body.companies = splitComma(params.companies);
		if (params.domains) body.domains = splitComma(params.domains);
		if (params.linkedin_urls) body.linkedin_urls = splitComma(params.linkedin_urls);
		const result = await pubrioRequest(this.apiKey, 'POST', '/monitors/create', body);
		return JSON.stringify(result);
	}
}

export class PubrioUpdateMonitor extends Tool {
	name = 'pubrio_update_monitor';
	description =
		'Update an existing monitor. Input: JSON with monitor_id (required) and optional name, description, detection_mode, signal_types (comma-separated), frequency_minute, max_daily_trigger, max_records_per_trigger, is_active (boolean), is_paused (boolean), notification_email, companies (comma-separated), domains (comma-separated), linkedin_urls (comma-separated).';
	private apiKey: string;

	constructor(config: PubrioConfig) {
		super();
		this.apiKey = config.apiKey;
	}

	async _call(input: string): Promise<string> {
		const params = parseInput(input);
		const body: Record<string, unknown> = {
			monitor_id: params.monitor_id,
		};
		if (params.name) body.name = params.name;
		if (params.description) body.description = params.description;
		if (params.detection_mode) body.detection_mode = params.detection_mode;
		if (params.signal_types) body.signal_types = splitComma(params.signal_types);
		if (params.frequency_minute != null) body.frequency_minute = params.frequency_minute;
		if (params.max_daily_trigger != null) body.max_daily_trigger = params.max_daily_trigger;
		if (params.max_records_per_trigger != null)
			body.max_records_per_trigger = params.max_records_per_trigger;
		if (params.is_active != null) body.is_active = params.is_active;
		if (params.is_paused != null) body.is_paused = params.is_paused;
		if (params.notification_email) body.notification_email = params.notification_email;
		if (params.companies) body.companies = splitComma(params.companies);
		if (params.domains) body.domains = splitComma(params.domains);
		if (params.linkedin_urls) body.linkedin_urls = splitComma(params.linkedin_urls);
		const result = await pubrioRequest(this.apiKey, 'POST', '/monitors/update', body);
		return JSON.stringify(result);
	}
}

export class PubrioGetMonitor extends Tool {
	name = 'pubrio_get_monitor';
	description =
		'Get details of a specific monitor. Input: JSON with monitor_id (required) and optional is_signature_reveal (boolean).';
	private apiKey: string;

	constructor(config: PubrioConfig) {
		super();
		this.apiKey = config.apiKey;
	}

	async _call(input: string): Promise<string> {
		const params = parseInput(input);
		const body: Record<string, unknown> = {
			monitor_id: params.monitor_id ?? params.query,
		};
		if (params.is_signature_reveal != null)
			body.is_signature_reveal = params.is_signature_reveal;
		const result = await pubrioRequest(this.apiKey, 'POST', '/monitors/lookup', body);
		return JSON.stringify(result);
	}
}

export class PubrioListMonitors extends Tool {
	name = 'pubrio_list_monitors';
	description =
		'List all monitors with pagination. Input: JSON with optional page, per_page, order_by, is_ascending_order (boolean).';
	private apiKey: string;

	constructor(config: PubrioConfig) {
		super();
		this.apiKey = config.apiKey;
	}

	async _call(input: string): Promise<string> {
		const params = parseInput(input);
		const body: Record<string, unknown> = {
			page: params.page ?? 1,
			per_page: params.per_page ?? 25,
		};
		if (params.order_by) body.order_by = params.order_by;
		if (params.is_ascending_order != null) body.is_ascending_order = params.is_ascending_order;
		const result = await pubrioRequest(this.apiKey, 'POST', '/monitors', body);
		return JSON.stringify(result);
	}
}

export class PubrioDeleteMonitor extends Tool {
	name = 'pubrio_delete_monitor';
	description = 'Delete a monitor. Input: JSON with monitor_id (required).';
	private apiKey: string;

	constructor(config: PubrioConfig) {
		super();
		this.apiKey = config.apiKey;
	}

	async _call(input: string): Promise<string> {
		const params = parseInput(input);
		const body: Record<string, unknown> = {
			monitor_id: params.monitor_id ?? params.query,
		};
		const result = await pubrioRequest(this.apiKey, 'POST', '/monitors/delete', body);
		return JSON.stringify(result);
	}
}

export class PubrioDuplicateMonitor extends Tool {
	name = 'pubrio_duplicate_monitor';
	description =
		'Duplicate an existing monitor. Input: JSON with monitor_id (required) and optional name.';
	private apiKey: string;

	constructor(config: PubrioConfig) {
		super();
		this.apiKey = config.apiKey;
	}

	async _call(input: string): Promise<string> {
		const params = parseInput(input);
		const body: Record<string, unknown> = {
			monitor_id: params.monitor_id ?? params.query,
		};
		if (params.name) body.name = params.name;
		const result = await pubrioRequest(this.apiKey, 'POST', '/monitors/duplicate', body);
		return JSON.stringify(result);
	}
}

export class PubrioTestRunMonitor extends Tool {
	name = 'pubrio_test_run_monitor';
	description =
		'Test run a monitor to preview results. Input: JSON with monitor_id (required) and optional tried_at (ISO 8601 timestamp).';
	private apiKey: string;

	constructor(config: PubrioConfig) {
		super();
		this.apiKey = config.apiKey;
	}

	async _call(input: string): Promise<string> {
		const params = parseInput(input);
		const body: Record<string, unknown> = {
			monitor_id: params.monitor_id ?? params.query,
		};
		if (params.tried_at) body.tried_at = params.tried_at;
		const result = await pubrioRequest(this.apiKey, 'POST', '/monitors/process/try', body);
		return JSON.stringify(result);
	}
}

export class PubrioRetryMonitor extends Tool {
	name = 'pubrio_retry_monitor';
	description =
		'Retry a failed monitor execution. Input: JSON with monitor_id (required), monitor_log_id (required), and optional is_use_original_destination (boolean).';
	private apiKey: string;

	constructor(config: PubrioConfig) {
		super();
		this.apiKey = config.apiKey;
	}

	async _call(input: string): Promise<string> {
		const params = parseInput(input);
		const body: Record<string, unknown> = {
			monitor_id: params.monitor_id,
			monitor_log_id: params.monitor_log_id,
		};
		if (params.is_use_original_destination != null)
			body.is_use_original_destination = params.is_use_original_destination;
		const result = await pubrioRequest(this.apiKey, 'POST', '/monitors/process/retry', body);
		return JSON.stringify(result);
	}
}

export class PubrioGetMonitorStats extends Tool {
	name = 'pubrio_get_monitor_stats';
	description = 'Get aggregate statistics for all monitors. No input required.';
	private apiKey: string;

	constructor(config: PubrioConfig) {
		super();
		this.apiKey = config.apiKey;
	}

	async _call(_input: string): Promise<string> {
		const result = await pubrioRequest(this.apiKey, 'POST', '/monitors/statistics', {});
		return JSON.stringify(result);
	}
}

export class PubrioGetMonitorLogs extends Tool {
	name = 'pubrio_get_monitor_logs';
	description =
		'Get execution logs for a monitor. Input: JSON with monitor_id (required) and optional page, per_page.';
	private apiKey: string;

	constructor(config: PubrioConfig) {
		super();
		this.apiKey = config.apiKey;
	}

	async _call(input: string): Promise<string> {
		const params = parseInput(input);
		const body: Record<string, unknown> = {
			monitor_id: params.monitor_id ?? params.query,
			page: params.page ?? 1,
			per_page: params.per_page ?? 25,
		};
		const result = await pubrioRequest(
			this.apiKey,
			'POST',
			'/monitors/statistics/logs',
			body,
		);
		return JSON.stringify(result);
	}
}

export class PubrioGetMonitorChart extends Tool {
	name = 'pubrio_get_monitor_chart';
	description =
		'Get chart data for a monitor over a date range. Input: JSON with monitor_id (required), start_date (required), end_date (required).';
	private apiKey: string;

	constructor(config: PubrioConfig) {
		super();
		this.apiKey = config.apiKey;
	}

	async _call(input: string): Promise<string> {
		const params = parseInput(input);
		const body: Record<string, unknown> = {
			monitor_id: params.monitor_id,
			start_date: params.start_date,
			end_date: params.end_date,
		};
		const result = await pubrioRequest(
			this.apiKey,
			'POST',
			'/monitors/statistics/chart',
			body,
		);
		return JSON.stringify(result);
	}
}

export class PubrioGetMonitorLogDetail extends Tool {
	name = 'pubrio_get_monitor_log_detail';
	description =
		'Get detailed information for a specific monitor log entry. Input: JSON with monitor_log_id (required).';
	private apiKey: string;

	constructor(config: PubrioConfig) {
		super();
		this.apiKey = config.apiKey;
	}

	async _call(input: string): Promise<string> {
		const params = parseInput(input);
		const body: Record<string, unknown> = {
			monitor_log_id: params.monitor_log_id ?? params.query,
		};
		const result = await pubrioRequest(
			this.apiKey,
			'POST',
			'/monitors/statistics/logs/lookup',
			body,
		);
		return JSON.stringify(result);
	}
}

export class PubrioValidateWebhook extends Tool {
	name = 'pubrio_validate_webhook';
	description =
		'Validate a webhook URL for use with monitors. Input: JSON with webhook_url (required) and optional headers (JSON string of custom headers).';
	private apiKey: string;

	constructor(config: PubrioConfig) {
		super();
		this.apiKey = config.apiKey;
	}

	async _call(input: string): Promise<string> {
		const params = parseInput(input);
		const body: Record<string, unknown> = {
			webhook_url: params.webhook_url ?? params.query,
		};
		if (params.headers) {
			body.headers =
				typeof params.headers === 'string' ? JSON.parse(params.headers as string) : params.headers;
		}
		const result = await pubrioRequest(
			this.apiKey,
			'POST',
			'/monitors/webhook/validate',
			body,
		);
		return JSON.stringify(result);
	}
}

export class PubrioRevealMonitorSignature extends Tool {
	name = 'pubrio_reveal_monitor_signature';
	description =
		'Reveal the signature of a monitor. Uses credits. Input: JSON with monitor_id (required).';
	private apiKey: string;

	constructor(config: PubrioConfig) {
		super();
		this.apiKey = config.apiKey;
	}

	async _call(input: string): Promise<string> {
		const params = parseInput(input);
		const body: Record<string, unknown> = {
			monitor_id: params.monitor_id ?? params.query,
		};
		const result = await pubrioRequest(
			this.apiKey,
			'POST',
			'/monitors/signature/reveal',
			body,
		);
		return JSON.stringify(result);
	}
}

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------

export class PubrioGetProfile extends Tool {
	name = 'pubrio_get_profile';
	description = 'Get the current user profile information. No input required.';
	private apiKey: string;

	constructor(config: PubrioConfig) {
		super();
		this.apiKey = config.apiKey;
	}

	async _call(_input: string): Promise<string> {
		const result = await pubrioRequest(this.apiKey, 'POST', '/profile', {});
		return JSON.stringify(result);
	}
}

export class PubrioGetUsage extends Tool {
	name = 'pubrio_get_usage';
	description = 'Get the current API usage statistics. No input required.';
	private apiKey: string;

	constructor(config: PubrioConfig) {
		super();
		this.apiKey = config.apiKey;
	}

	async _call(_input: string): Promise<string> {
		const result = await pubrioRequest(this.apiKey, 'POST', '/profile/usage', {});
		return JSON.stringify(result);
	}
}
