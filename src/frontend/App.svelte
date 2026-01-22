<script lang="ts">
	/// <reference lib="dom" />
	/// <reference lib="dom.iterable" />

	import {
		mockListFiles,
		mockUploadFile,
		mockDeleteFile,
		mockDownloadFile,
	} from './utils/mockData.js';
	import { formatBytes, formatDate } from './utils/helpers.js';
	import FileCard from './components/FileCard.svelte';
	import Toast from './components/Toast.svelte';
	import UploadArea from './components/UploadArea.svelte';

	// Development mode detection
	const isDev = import.meta.env.DEV;

	// Type definitions
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

	type ToastMessage = {
		id: number;
		message: string;
		type: 'success' | 'error' | 'warning';
	};

	// State
	let files = $state<FileInfo[]>([]);
	let uploadProgress = $state(0);
	let isUploading = $state(false);
	let uploadFileName = $state('');
	let toasts = $state<ToastMessage[]>([]);
	let toastIdCounter = $state(0);

	// Load files on mount
	$effect(() => {
		loadFiles();
	});

	/**
	 * Show a toast notification
	 */
	function showToast(message: string, type: ToastMessage['type'] = 'success'): void {
		const id = toastIdCounter++;
		toasts.push({ id, message, type });

		// Auto-remove after 5 seconds
		setTimeout(() => {
			removeToast(id);
		}, 5000);
	}

	/**
	 * Remove a toast notification
	 */
	function removeToast(id: number): void {
		toasts = toasts.filter((t) => t.id !== id);
	}

	/**
	 * Load and display files
	 */
	async function loadFiles(): Promise<void> {
		try {
			let data: ListResponse;

			if (isDev) {
				data = await mockListFiles();
			} else {
				const response = await fetch('/api/files');
				data = (await response.json()) as ListResponse;
			}

			files = [...data.files];
		} catch (error) {
			console.error('Load files error:', error);
			showToast('Failed to load files', 'error');
		}
	}

	/**
	 * Upload files
	 */
	async function handleFilesSelected(selectedFiles: File[]): Promise<void> {
		for (const file of selectedFiles) {
			await uploadFile(file);
		}
	}

	/**
	 * Upload a single file
	 */
	async function uploadFile(file: File): Promise<void> {
		try {
			isUploading = true;
			uploadProgress = 0;
			uploadFileName = file.name;

			// Simulate progress
			animateProgress(0, 90, 500);

			let result: UploadResponse;

			if (isDev) {
				result = await mockUploadFile(file);
			} else {
				const formData = new FormData();
				formData.append('file', file);

				const response = await fetch('/api/upload', {
					method: 'POST',
					body: formData,
				});

				result = (await response.json()) as UploadResponse;
			}

			// Complete progress
			animateProgress(90, 100, 100);

			if (result.success) {
				showToast(result.message, 'success');
				await loadFiles();
			} else {
				showToast(result.message || result.error || 'Upload failed', !isDev && result.error ? 'warning' : 'error');
			}
		} catch (error) {
			console.error('Upload error:', error);
			showToast('Failed to upload file', 'error');
		} finally {
			setTimeout(() => {
				isUploading = false;
				uploadProgress = 0;
				uploadFileName = '';
			}, 1000);
		}
	}

	/**
	 * Animate progress bar
	 */
	function animateProgress(from: number, to: number, duration: number): void {
		const start = Date.now();
		const tick = (): void => {
			const elapsed = Date.now() - start;
			const progress = Math.min(elapsed / duration, 1);
			uploadProgress = from + (to - from) * progress;

			if (progress < 1) {
				requestAnimationFrame(tick);
			}
		};
		requestAnimationFrame(tick);
	}

	/**
	 * Download a file
	 */
	async function handleDownload(file: FileInfo): Promise<void> {
		try {
			let url: string;

			if (isDev) {
				const mockUrl = await mockDownloadFile(file.key);
				if (!mockUrl) {
					showToast('File not found', 'error');
					return;
				}
				url = mockUrl;
			} else {
				url = `/api/files/${encodeURIComponent(file.key)}`;
			}

			const link = document.createElement('a');
			link.href = url;
			link.download = file.name;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);

			if (isDev) {
				setTimeout(() => URL.revokeObjectURL(url), 100);
			}

			showToast(`Downloading ${file.name}`, 'success');
		} catch (error) {
			console.error('Download error:', error);
			showToast('Failed to download file', 'error');
		}
	}

	/**
	 * Delete a file
	 */
	async function handleDelete(file: FileInfo): Promise<void> {
		if (!confirm(`Are you sure you want to delete "${file.name}"?`)) {
			return;
		}

		try {
			let result: { success: boolean; message?: string; error?: string };

			if (isDev) {
				result = await mockDeleteFile(file.key);
			} else {
				const response = await fetch(`/api/files/${encodeURIComponent(file.key)}`, {
					method: 'DELETE',
				});

				result = (await response.json()) as { success: boolean; error?: string };
			}

			if (result.success) {
				showToast(result.message || 'File deleted successfully', 'success');
				await loadFiles();
			} else {
				showToast(result.error || 'Failed to delete file', 'error');
			}
		} catch (error) {
			console.error('Delete error:', error);
			showToast('Failed to delete file', 'error');
		}
	}

	/**
	 * Handle refresh button
	 */
	async function handleRefresh(): Promise<void> {
		await loadFiles();
		showToast('Files refreshed', 'success');
	}
</script>

<div class="container">
	<header class="header">
		<h1 class="title">
			<svg class="title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5"/>
			</svg>
			Secret Cloud Storage
		</h1>
		<p class="subtitle">Secure file transfer between your devices</p>
	</header>

	<main class="main">
		<!-- Upload Section -->
		<section class="upload-section">
			<UploadArea 
				{isUploading}
				{uploadProgress}
				{uploadFileName}
				onFilesSelected={handleFilesSelected}
			/>
		</section>

		<!-- Files Section -->
		<section class="files-section">
			<div class="section-header">
				<h2 class="section-title">Your Files</h2>
				<button class="refresh-btn" onclick={handleRefresh} aria-label="Refresh file list">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<polyline points="23 4 23 10 17 10"/>
						<polyline points="1 20 1 14 7 14"/>
						<path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
					</svg>
				</button>
			</div>

			{#if files.length === 0}
				<div class="empty-state visible">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
						<polyline points="13 2 13 9 20 9"/>
					</svg>
					<p>No files yet. Upload your first file to get started!</p>
				</div>
			{:else}
				<div class="files-list">
					{#each files as file (file.key)}
						<FileCard 
							{file}
							onDownload={() => handleDownload(file)}
							onDelete={() => handleDelete(file)}
						/>
					{/each}
				</div>
			{/if}
		</section>
	</main>

	<!-- Toast Notifications -->
	<div class="toast-container">
		{#each toasts as toast (toast.id)}
			<Toast 
				message={toast.message}
				type={toast.type}
				onClose={() => removeToast(toast.id)}
			/>
		{/each}
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}

	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: var(--spacing-lg) var(--spacing-md);
	}

	.header {
		text-align: center;
		margin-bottom: var(--spacing-2xl);
		animation: fadeInDown 0.6s ease-out;
	}

	.title {
		font-size: 1.875rem;
		font-weight: 700;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--spacing-sm);
		margin-bottom: var(--spacing-xs);
		background: linear-gradient(135deg, var(--color-accent) 0%, hsl(200, 85%, 65%) 100%);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.title-icon {
		width: 1.875rem;
		height: 1.875rem;
		stroke: var(--color-accent);
	}

	.subtitle {
		color: var(--color-text-secondary);
		font-size: 1rem;
		font-weight: 400;
	}

	.main {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-2xl);
	}

	.section-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--spacing-lg);
	}

	.section-title {
		font-size: 1.5rem;
		font-weight: 600;
		color: var(--color-text-primary);
	}

	.refresh-btn {
		background: var(--color-surface);
		border: 1px solid hsl(220, 15%, 25%);
		border-radius: var(--radius-md);
		padding: var(--spacing-sm);
		cursor: pointer;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.refresh-btn:hover {
		background: var(--color-surface-hover);
		box-shadow: var(--shadow-sm);
	}

	.refresh-btn svg {
		width: 1.125rem;
		height: 1.125rem;
		color: var(--color-text-secondary);
	}

	.files-list {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
	}

	.empty-state {
		text-align: center;
		padding: var(--spacing-2xl);
		opacity: 0;
		transform: scale(0.95);
		transition: all 0.3s ease;
	}

	.empty-state.visible {
		opacity: 1;
		transform: scale(1);
	}

	.empty-state svg {
		width: 4rem;
		height: 4rem;
		color: var(--color-text-tertiary);
		margin-bottom: var(--spacing-lg);
	}

	.empty-state p {
		color: var(--color-text-secondary);
		font-size: 1rem;
	}

	.toast-container {
		position: fixed;
		top: var(--spacing-lg);
		right: var(--spacing-lg);
		z-index: 1000;
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}

	@keyframes fadeInDown {
		from {
			opacity: 0;
			transform: translateY(-20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
