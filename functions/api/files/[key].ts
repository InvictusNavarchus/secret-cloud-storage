import type { Environment } from '../../../src/types/environment';
import { handleDownload } from '../../../src/handlers/download';
import { handleDelete } from '../../../src/handlers/delete';
import { corsResponse, errorResponse } from '../../../src/utils/response';

/**
 * GET /api/files/:key - Download a file
 */
export const onRequestGet = async (context: { params: { key: string }; env: Environment }) => {
	const key = context.params.key as string;
	
	if (!key) {
		return errorResponse('File key required', 400);
	}
	
	return handleDownload(decodeURIComponent(key), context.env);
};

/**
 * DELETE /api/files/:key - Delete a file
 */
export const onRequestDelete = async (context: { params: { key: string }; env: Environment }) => {
	const key = context.params.key as string;
	
	if (!key) {
		return errorResponse('File key required', 400);
	}
	
	return handleDelete(decodeURIComponent(key), context.env);
};

/**
 * OPTIONS /api/files/:key - CORS preflight
 */
export const onRequestOptions = async () => {
	return corsResponse();
};
