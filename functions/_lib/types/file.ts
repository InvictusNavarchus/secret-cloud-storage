/**
 * Metadata for stored files
 */
export interface FileMetadata {
	/**
	 * Original filename
	 */
	readonly name: string;

	/**
	 * File size in bytes
	 */
	readonly size: number;

	/**
	 * MIME type
	 */
	readonly contentType: string;

	/**
	 * Upload timestamp (ISO 8601)
	 */
	readonly uploadedAt: string;

	/**
	 * SHA-256 checksum
	 */
	readonly checksum: string;
}

/**
 * File information for listing
 */
export interface FileInfo extends FileMetadata {
	/**
	 * Storage key (may differ from original name if timestamp was appended)
	 */
	readonly key: string;
}

/**
 * Response for file upload
 */
export interface UploadResponse {
	/**
	 * Success status
	 */
	readonly success: boolean;

	/**
	 * Message to display
	 */
	readonly message: string;

	/**
	 * File info if successful
	 */
	readonly file?: FileInfo;

	/**
	 * Error details if failed
	 */
	readonly error?: string;
}

/**
 * Response for file list
 */
export interface ListResponse {
	/**
	 * List of files
	 */
	readonly files: readonly FileInfo[];

	/**
	 * Total count
	 */
	readonly count: number;
}
