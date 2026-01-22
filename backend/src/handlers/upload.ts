import type { Environment } from '../types/environment.ts';
import type { UploadResponse } from '../types/file.ts';
import { calculateChecksum, generateTimestampedKey } from '../utils/file.ts';
import { errorResponse, jsonResponse } from '../utils/response.ts';

/**
 * Handle file upload
 * @param request - Incoming request with multipart form data
 * @param env - Environment bindings
 * @returns Upload response
 */
export async function handleUpload(
	request: Request,
	env: Environment
): Promise<Response> {
	try {
		const formData = await request.formData();
		const file = formData.get('file');

		if (!file || typeof file === 'string') {
			return errorResponse('No file provided', 400);
		}

		// Read file data
		const arrayBuffer = await file.arrayBuffer();
		const checksum = await calculateChecksum(arrayBuffer);

		// Check if file with same checksum already exists
		const existingFile = await findFileByChecksum(env.BUCKET, checksum);

		if (existingFile) {
			return jsonResponse(
				{
					success: false,
					message: 'This file already exists in storage',
					file: {
						key: existingFile.key,
						name: existingFile.customMetadata?.originalName || existingFile.key,
						size: existingFile.size,
						contentType:
							existingFile.customMetadata?.contentType ||
							'application/octet-stream',
						uploadedAt:
							existingFile.customMetadata?.uploadedAt ||
							new Date(existingFile.uploaded).toISOString(),
						checksum,
					},
				} satisfies UploadResponse,
				409
			);
		}

		// Check if filename exists with different content
		const existingByName = await env.BUCKET.head(file.name);
		let storageKey = file.name;

		if (existingByName) {
			// Different file, same name - append timestamp
			storageKey = generateTimestampedKey(file.name);
		}

		// Store file with metadata
		const uploadedAt = new Date().toISOString();
		await env.BUCKET.put(storageKey, arrayBuffer, {
			customMetadata: {
				originalName: file.name,
				contentType: file.type || 'application/octet-stream',
				uploadedAt,
				checksum,
			},
		});

		return jsonResponse(
			{
				success: true,
				message: 'File uploaded successfully',
				file: {
					key: storageKey,
					name: file.name,
					size: file.size,
					contentType: file.type || 'application/octet-stream',
					uploadedAt,
					checksum,
				},
			} satisfies UploadResponse,
			201
		);
	} catch (error) {
		console.error('Upload error:', error);
		return errorResponse(
			error instanceof Error ? error.message : 'Upload failed',
			500
		);
	}
}

/**
 * Find a file by its checksum
 * @param bucket - R2 bucket
 * @param checksum - SHA-256 checksum to search for
 * @returns R2 object if found, null otherwise
 */
async function findFileByChecksum(
	bucket: R2Bucket,
	checksum: string
): Promise<R2Object | null> {
	const listed = await bucket.list();

	for (const object of listed.objects) {
		const obj = await bucket.get(object.key);
		if (obj?.customMetadata?.checksum === checksum) {
			return obj;
		}
	}

	return null;
}
