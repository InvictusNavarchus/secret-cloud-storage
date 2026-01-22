import type { Environment } from '../../../src/types/environment';
import { handleList } from '../../../src/handlers/list';
import { corsResponse } from '../../../src/utils/response';

/**
 * GET /api/files - List all files
 */
export const onRequestGet = async (context: { env: Environment }) => {
	return handleList(context.env);
};

/**
 * OPTIONS /api/files - CORS preflight
 */
export const onRequestOptions = async () => {
	return corsResponse();
};
