import type { Environment } from '../types/environment.ts';
import { errorResponse, jsonResponse } from '../utils/response.ts';

/**
 * Handle file deletion
 * @param key - File key to delete
 * @param env - Environment bindings
 * @returns Deletion response
 */
export async function handleDelete(
	key: string,
	env: Environment
): Promise<Response> {
	try {
		// Check if file exists
		const object = await env.BUCKET.head(key);

		if (!object) {
			return errorResponse('File not found', 404);
		}

		// Delete the file
		await env.BUCKET.delete(key);

		return jsonResponse({
			success: true,
			message: 'File deleted successfully',
		});
	} catch (error) {
		console.error('Delete error:', error);
		return errorResponse(
			error instanceof Error ? error.message : 'Deletion failed',
			500
		);
	}
}
