import type { Environment } from '../_lib/types/environment';
import { handleUpload } from '../_lib/handlers/upload';
import { corsResponse } from '../_lib/utils/response';

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
