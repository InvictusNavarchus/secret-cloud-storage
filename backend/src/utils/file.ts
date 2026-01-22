/**
 * Calculate SHA-256 checksum of a file
 * @param data - File data as ArrayBuffer
 * @returns Hex-encoded SHA-256 checksum
 */
export async function calculateChecksum(data: ArrayBuffer): Promise<string> {
	const hashBuffer = await crypto.subtle.digest('SHA-256', data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Generate a storage key with ISO timestamp appended
 * @param filename - Original filename
 * @returns Storage key with timestamp
 */
export function generateTimestampedKey(filename: string): string {
	const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
	const lastDotIndex = filename.lastIndexOf('.');
	
	if (lastDotIndex === -1) {
		return `${filename}_${timestamp}`;
	}
	
	const name = filename.substring(0, lastDotIndex);
	const extension = filename.substring(lastDotIndex);
	return `${name}_${timestamp}${extension}`;
}

/**
 * Parse custom metadata from R2 object
 * @param object - R2 object with custom metadata
 * @returns Parsed metadata values
 */
export function parseMetadata(object: R2Object): {
	name: string;
	contentType: string;
	uploadedAt: string;
	checksum: string;
} {
	const metadata = object.customMetadata || {};
	return {
		name: metadata.originalName || object.key,
		contentType: metadata.contentType || 'application/octet-stream',
		uploadedAt: metadata.uploadedAt || new Date(object.uploaded).toISOString(),
		checksum: metadata.checksum || '',
	};
}
