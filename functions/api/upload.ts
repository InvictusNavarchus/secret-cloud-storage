import type { Environment } from '../../src/types/environment';
import { handleUpload } from '../../src/handlers/upload';
import { corsResponse } from '../../src/utils/response';

/**
 * POST /api/upload - Upload a file
 */
export const onRequestPost = async (context: { request: Request; env: Environment }) => {
	return handleUpload(context.request, context.env);
};

/**
 * OPTIONS /api/upload - CORS preflight
 */
export const onRequestOptions = async () => {
	return corsResponse();
};
