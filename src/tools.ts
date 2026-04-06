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
