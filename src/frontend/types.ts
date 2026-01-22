export interface FileMetadata {
	readonly name: string;
	readonly size: number;
	readonly contentType: string;
	readonly uploadedAt: string;
	readonly checksum: string;
}

export interface FileInfo extends FileMetadata {
	readonly key: string;
}

export interface UploadResponse {
	readonly success: boolean;
	readonly message: string;
	readonly file?: FileInfo;
	readonly error?: string;
}

export interface ListResponse {
	readonly files: readonly FileInfo[];
	readonly count: number;
}
