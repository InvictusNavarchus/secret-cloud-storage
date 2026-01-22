import type { Environment } from '../../_lib/types/environment';
import { handleList } from '../../_lib/handlers/list';
import { corsResponse } from '../../_lib/utils/response';

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
