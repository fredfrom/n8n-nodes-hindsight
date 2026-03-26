import type { IExecuteFunctions, IHttpRequestMethods, IHttpRequestOptions } from 'n8n-workflow';

export async function hindsightApiRequest(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	path: string,
	body?: object,
	qs?: Record<string, string | number | boolean | undefined>,
): Promise<unknown> {
	const credentials = await this.getCredentials('hindsightApi');
	const baseUrl = (credentials.baseUrl as string).replace(/\/$/, '');

	const options: IHttpRequestOptions = {
		method,
		url: `${baseUrl}${path}`,
		json: true,
	};

	if (body && Object.keys(body).length > 0) {
		options.body = body;
	}

	if (qs && Object.keys(qs).length > 0) {
		const cleanQs: Record<string, string | number | boolean> = {};
		for (const [key, value] of Object.entries(qs)) {
			if (value !== undefined) {
				cleanQs[key] = value;
			}
		}
		if (Object.keys(cleanQs).length > 0) {
			options.qs = cleanQs;
		}
	}

	return await this.helpers.httpRequestWithAuthentication.call(
		this,
		'hindsightApi',
		options,
	);
}
