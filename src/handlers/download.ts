import type { Environment } from '../types/environment.ts';
import { errorResponse, jsonResponse } from '../utils/response.ts';

/**
 * Handle file download
 * @param key - File key to download
 * @param env - Environment bindings
 * @returns File response
 */
export async function handleDownload(
	key: string,
	env: Environment
): Promise<Response> {
	try {
		const object = await env.BUCKET.get(key);

		if (!object) {
			return errorResponse('File not found', 404);
		}

		const headers = new Headers();
		object.writeHttpMetadata(headers);
		headers.set('etag', object.httpEtag);

		// Set download filename from metadata
		const originalName = object.customMetadata?.originalName || key;
		headers.set(
			'Content-Disposition',
			`attachment; filename="${originalName}"`
		);

		return new Response(object.body, { headers });
	} catch (error) {
		console.error('Download error:', error);
		return errorResponse(
			error instanceof Error ? error.message : 'Download failed',
			500
		);
	}
}
