import type { Environment } from './types/environment.ts';
import { handleUpload } from './handlers/upload.ts';
import { handleList } from './handlers/list.ts';
import { handleDownload } from './handlers/download.ts';
import { handleDelete } from './handlers/delete.ts';
import { corsResponse, errorResponse } from './utils/response.ts';

/**
 * Main Worker fetch handler
 */
export default {
	async fetch(
		request: Request,
		env: Environment,
		_ctx: ExecutionContext
	): Promise<Response> {
		const url = new URL(request.url);
		const { pathname, method } = { pathname: url.pathname, method: request.method };

		// Handle CORS preflight
		if (method === 'OPTIONS') {
			return corsResponse();
		}

		// API routes
		if (pathname.startsWith('/api/')) {
			return handleApiRequest(pathname, method, request, env);
		}

		// Serve static assets from /public
		return env.ASSETS.fetch(request);
	},
} satisfies ExportedHandler<Environment>;

/**
 * Route API requests to appropriate handlers
 * @param pathname - Request pathname
 * @param method - HTTP method
 * @param request - Request object
 * @param env - Environment bindings
 * @returns Response
 */
async function handleApiRequest(
	pathname: string,
	method: string,
	request: Request,
	env: Environment
): Promise<Response> {
	// POST /api/upload - Upload a file
	if (pathname === '/api/upload' && method === 'POST') {
		return handleUpload(request, env);
	}

	// GET /api/files - List all files
	if (pathname === '/api/files' && method === 'GET') {
		return handleList(env);
	}

	// GET /api/files/:key - Download a file
	if (pathname.startsWith('/api/files/') && method === 'GET') {
		const key = decodeURIComponent(pathname.substring('/api/files/'.length));
		if (!key) {
			return errorResponse('File key required', 400);
		}
		return handleDownload(key, env);
	}

	// DELETE /api/files/:key - Delete a file
	if (pathname.startsWith('/api/files/') && method === 'DELETE') {
		const key = decodeURIComponent(pathname.substring('/api/files/'.length));
		if (!key) {
			return errorResponse('File key required', 400);
		}
		return handleDelete(key, env);
	}

	return errorResponse('Not found', 404);
}
