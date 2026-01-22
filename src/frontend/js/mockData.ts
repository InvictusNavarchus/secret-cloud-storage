/**
 * Mock data for development mode when API is not available
 * Uses the exact same types as production
 */

interface FileMetadata {
	readonly name: string;
	readonly size: number;
	readonly contentType: string;
	readonly uploadedAt: string;
	readonly checksum: string;
}

interface FileInfo extends FileMetadata {
	readonly key: string;
}

interface UploadResponse {
	readonly success: boolean;
	readonly message: string;
	readonly file?: FileInfo;
	readonly error?: string;
}

interface ListResponse {
	readonly files: readonly FileInfo[];
	readonly count: number;
}

/**
 * Mock file storage
 */
let mockFiles: FileInfo[] = [
	{
		key: 'document_2026-01-22T10-30-45.pdf',
		name: 'document.pdf',
		size: 2456789,
		contentType: 'application/pdf',
		uploadedAt: '2026-01-22T10:30:45.123Z',
		checksum: 'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
	},
	{
		key: 'vacation-photo_2026-01-20T14-15-30.jpg',
		name: 'vacation-photo.jpg',
		size: 3845120,
		contentType: 'image/jpeg',
		uploadedAt: '2026-01-20T14:15:30.456Z',
		checksum: 'f1e2d3c4b5a6789012345678901234567890fedcba1234567890fedcba654321',
	},
	{
		key: 'report_2026-01-19T09-00-00.docx',
		name: 'report.docx',
		size: 125678,
		contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		uploadedAt: '2026-01-19T09:00:00.789Z',
		checksum: '123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0',
	},
];

/**
 * Mock API: List files
 */
export async function mockListFiles(): Promise<ListResponse> {
	// Simulate network delay
	await new Promise((resolve) => setTimeout(resolve, 200));
	
	return {
		files: [...mockFiles],
		count: mockFiles.length,
	};
}

/**
 * Mock API: Upload file
 */
export async function mockUploadFile(file: File): Promise<UploadResponse> {
	// Simulate network delay
	await new Promise((resolve) => setTimeout(resolve, 800));
	
	// Check for duplicate
	const exists = mockFiles.some((f) => f.name === file.name);
	if (exists) {
		return {
			success: false,
			message: `File "${file.name}" already exists`,
		};
	}
	
	// Create mock file info
	const now = new Date().toISOString();
	const timestamp = now.replace(/[:.]/g, '-').slice(0, 19);
	const key = `${file.name.replace(/\.[^/.]+$/, '')}_${timestamp}${file.name.match(/\.[^/.]+$/)?.[0] || ''}`;
	
	// Generate mock checksum
	const checksum = Array.from({ length: 64 }, () => 
		Math.floor(Math.random() * 16).toString(16)
	).join('');
	
	const newFile: FileInfo = {
		key,
		name: file.name,
		size: file.size,
		contentType: file.type || 'application/octet-stream',
		uploadedAt: now,
		checksum,
	};
	
	mockFiles.unshift(newFile);
	
	return {
		success: true,
		message: `Successfully uploaded "${file.name}"`,
		file: newFile,
	};
}

/**
 * Mock API: Delete file
 */
export async function mockDeleteFile(key: string): Promise<{ success: boolean; message: string }> {
	// Simulate network delay
	await new Promise((resolve) => setTimeout(resolve, 300));
	
	const index = mockFiles.findIndex((f) => f.key === key);
	
	if (index === -1) {
		return {
			success: false,
			message: 'File not found',
		};
	}
	
	const fileToDelete = mockFiles[index];
	if (!fileToDelete) {
		return {
			success: false,
			message: 'File not found',
		};
	}
	
	const fileName = fileToDelete.name;
	mockFiles.splice(index, 1);
	
	return {
		success: true,
		message: `Successfully deleted "${fileName}"`,
	};
}

/**
 * Mock API: Download file (returns a blob URL)
 */
export async function mockDownloadFile(key: string): Promise<string | null> {
	// Simulate network delay
	await new Promise((resolve) => setTimeout(resolve, 400));
	
	const file = mockFiles.find((f) => f.key === key);
	
	if (!file) {
		return null;
	}
	
	// Create a fake blob with some content
	const content = `This is mock content for ${file.name}`;
	const blob = new Blob([content], { type: file.contentType });
	return URL.createObjectURL(blob);
}
