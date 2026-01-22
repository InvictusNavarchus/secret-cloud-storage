<script lang="ts">
	import type { FileInfo } from '../types.js';
	import { formatBytes, formatDate, getFileIcon } from '../utils/helpers.js';

	interface Props {
		file: FileInfo;
		onDownload: () => void;
		onDelete: () => void;
	}

	let { file, onDownload, onDelete }: Props = $props();
</script>

<div class="file-card">
	<div class="file-info">
		<div class="file-icon">
			{@html getFileIcon(file.contentType)}
		</div>
		<div class="file-name" title={file.name}>{file.name}</div>
	</div>
	<div class="file-meta">
		{formatBytes(file.size)}
	</div>
	<div class="file-meta">
		{formatDate(file.uploadedAt)}
	</div>
	<div class="file-meta file-meta-item" title="SHA-256: {file.checksum}">
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
			<path d="M7 11V7a5 5 0 0 1 10 0v4"/>
		</svg>
		{file.checksum.substring(0, 8)}...
	</div>
	<div class="file-actions">
		<button class="btn btn-primary" onclick={onDownload} aria-label="Download {file.name}">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
				<polyline points="7 10 12 15 17 10"/>
				<line x1="12" y1="15" x2="12" y2="3"/>
			</svg>
			Download
		</button>
		<button class="btn btn-danger" onclick={onDelete} aria-label="Delete {file.name}">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<polyline points="3 6 5 6 21 6"/>
				<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
			</svg>
			Delete
		</button>
	</div>
</div>

<style>
	.file-card {
		display: grid;
		grid-template-columns: 1.5fr 0.75fr 0.75fr 1fr 1fr;
		gap: var(--spacing-lg);
		align-items: center;
		background: var(--color-surface);
		border: 1px solid hsl(220, 15%, 25%);
		border-radius: var(--radius-md);
		padding: var(--spacing-lg);
		transition: all 0.2s ease;
	}

	.file-card:hover {
		background: var(--color-surface-hover);
		box-shadow: var(--shadow-sm);
		border-color: var(--color-accent);
	}

	.file-info {
		display: flex;
		align-items: center;
		gap: var(--spacing-md);
		min-width: 0;
	}

	.file-icon {
		flex-shrink: 0;
		width: 2.5rem;
		height: 2.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color-bg-tertiary);
		border-radius: var(--radius-sm);
		color: var(--color-accent);
	}

	.file-icon :global(svg) {
		width: 1.5rem;
		height: 1.5rem;
	}

	.file-name {
		font-weight: 500;
		color: var(--color-text-primary);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.file-meta {
		color: var(--color-text-secondary);
		font-size: 0.875rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.file-meta-item {
		display: flex;
		align-items: center;
		gap: var(--spacing-xs);
	}

	.file-meta-item svg {
		width: 1rem;
		height: 1rem;
		flex-shrink: 0;
		color: var(--color-text-tertiary);
	}

	.file-actions {
		display: flex;
		gap: var(--spacing-sm);
		justify-content: flex-end;
	}

	.btn {
		display: flex;
		align-items: center;
		gap: var(--spacing-xs);
		padding: var(--spacing-sm) var(--spacing-md);
		border: none;
		border-radius: var(--radius-sm);
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
		white-space: nowrap;
	}

	.btn svg {
		width: 1rem;
		height: 1rem;
	}

	.btn-primary {
		background: var(--color-accent);
		color: white;
	}

	.btn-primary:hover {
		background: var(--color-accent-hover);
		box-shadow: var(--shadow-glow);
	}

	.btn-danger {
		background: transparent;
		color: var(--color-error);
		border: 1px solid var(--color-error);
	}

	.btn-danger:hover {
		background: var(--color-error);
		color: white;
	}

	@media (max-width: 768px) {
		.file-card {
			grid-template-columns: 1fr;
			gap: var(--spacing-sm);
		}

		.file-actions {
			justify-content: stretch;
		}

		.btn {
			flex: 1;
		}
	}
</style>
