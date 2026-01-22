/**
 * Format bytes to human-readable size
 */
export function formatBytes(bytes: number): string {
	if (bytes === 0) return '0 B';
	const k = 1024;
	const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Format ISO date to human-readable format
 */
export function formatDate(isoDate: string): string {
	const date = new Date(isoDate);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffHours = diffMs / (1000 * 60 * 60);

	if (diffHours < 1) {
		const diffMinutes = Math.floor(diffMs / (1000 * 60));
		return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
	}
	if (diffHours < 24) {
		return `${Math.floor(diffHours)} hour${Math.floor(diffHours) !== 1 ? 's' : ''} ago`;
	}
	if (diffHours < 48) {
		return 'Yesterday';
	}

	return date.toLocaleDateString(undefined, {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	});
}

/**
 * Get file icon based on content type
 */
export function getFileIcon(contentType: string): string {
	if (contentType.startsWith('image/')) {
		return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
			<circle cx="8.5" cy="8.5" r="1.5"/>
			<polyline points="21 15 16 10 5 21"/>
		</svg>`;
	}
	if (contentType.startsWith('video/')) {
		return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			<polygon points="23 7 16 12 23 17 23 7"/>
			<rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
		</svg>`;
	}
	if (contentType.startsWith('audio/')) {
		return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			<path d="M9 18V5l12-2v13"/>
			<circle cx="6" cy="18" r="3"/>
			<circle cx="18" cy="16" r="3"/>
		</svg>`;
	}
	if (contentType.includes('pdf')) {
		return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
			<polyline points="14 2 14 8 20 8"/>
			<line x1="16" y1="13" x2="8" y2="13"/>
			<line x1="16" y1="17" x2="8" y2="17"/>
			<polyline points="10 9 9 9 8 9"/>
		</svg>`;
	}
	if (contentType.includes('zip') || contentType.includes('rar') || contentType.includes('archive')) {
		return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/>
			<path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
		</svg>`;
	}
	return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
		<path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
		<polyline points="13 2 13 9 20 9"/>
	</svg>`;
}
