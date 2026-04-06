const BASE_URL = 'https://api.pubrio.com';

export interface PubrioConfig {
	apiKey: string;
}

export async function pubrioRequest(
	apiKey: string,
	method: string,
	endpoint: string,
	body?: Record<string, unknown>,
): Promise<unknown> {
	const options: RequestInit = {
		method,
		headers: {
			'pubrio-api-key': apiKey,
			'Content-Type': 'application/json',
		},
	};

	if (body && Object.keys(body).length > 0) {
		options.body = JSON.stringify(body);
	}

	const response = await fetch(`${BASE_URL}${endpoint}`, options);

	if (!response.ok) {
		const text = await response.text();
		throw new Error(`Pubrio API error ${response.status}: ${text}`);
	}

	const json = await response.json();
	return json.data !== undefined ? json.data : json;
}
