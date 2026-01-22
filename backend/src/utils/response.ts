/**
 * Create a JSON response with CORS headers
 * @param data - Data to serialize
 * @param status - HTTP status code
 * @returns Response object
 */
export function jsonResponse(data: unknown, status = 200): Response {
	return new Response(JSON.stringify(data), {
		status,
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type',
		},
	});
}

/**
 * Create an error response
 * @param error - Error message
 * @param status - HTTP status code
 * @returns Error response
 */
export function errorResponse(error: string, status = 400): Response {
	return jsonResponse({ success: false, error }, status);
}

/**
 * Create a CORS preflight response
 * @returns CORS response
 */
export function corsResponse(): Response {
	return new Response(null, {
		status: 204,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type',
			'Access-Control-Max-Age': '86400',
		},
	});
}
