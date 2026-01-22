import type { Environment } from '../types/environment.ts';
import type { ListResponse, FileInfo } from '../types/file.ts';
import { parseMetadata } from '../utils/file.ts';
import { errorResponse, jsonResponse } from '../utils/response.ts';

/**
 * Handle file listing
 * @param env - Environment bindings
 * @returns List of files
 */
export async function handleList(env: Environment): Promise<Response> {
	try {
		const listed = await env.BUCKET.list();
		const files: FileInfo[] = [];

		for (const object of listed.objects) {
			const obj = await env.BUCKET.head(object.key);
			if (!obj) continue;

			const metadata = parseMetadata(obj);
			files.push({
				key: obj.key,
				name: metadata.name,
				size: obj.size,
				contentType: metadata.contentType,
				uploadedAt: metadata.uploadedAt,
				checksum: metadata.checksum,
			});
		}

		// Sort by upload date (newest first)
		files.sort(
			(a, b) =>
				new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
		);

		return jsonResponse({
			files,
			count: files.length,
		} satisfies ListResponse);
	} catch (error) {
		console.error('List error:', error);
		return errorResponse(
			error instanceof Error ? error.message : 'Failed to list files',
			500
		);
	}
}
