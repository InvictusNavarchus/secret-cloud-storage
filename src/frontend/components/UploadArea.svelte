<script lang="ts">
	interface Props {
		isUploading: boolean;
		uploadProgress: number;
		uploadFileName: string;
		onFilesSelected: (files: File[]) => void;
	}

	let { isUploading, uploadProgress, uploadFileName, onFilesSelected }: Props = $props();

	let fileInput: HTMLInputElement;
	let isDragOver = $state(false);

	function handleClick() {
		fileInput.click();
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			fileInput.click();
		}
	}

	function handleFileInputChange(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			onFilesSelected(Array.from(input.files));
			input.value = ''; // Reset input
		}
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		isDragOver = true;
	}

	function handleDragLeave() {
		isDragOver = false;
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		isDragOver = false;

		const files = event.dataTransfer?.files;
		if (files && files.length > 0) {
			onFilesSelected(Array.from(files));
		}
	}
</script>

<div 
	class="upload-area" 
	class:drag-over={isDragOver}
	onclick={handleClick}
	onkeydown={handleKeyDown}
	ondragover={handleDragOver}
	ondragleave={handleDragLeave}
	ondrop={handleDrop}
	role="button"
	tabindex="0"
>
	<div class="upload-icon">
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
			<polyline points="17 8 12 3 7 8"/>
			<line x1="12" y1="3" x2="12" y2="15"/>
		</svg>
	</div>
	<h2 class="upload-title">Drop files here or click to upload</h2>
	<p class="upload-desc">Supports all file types</p>
	<input 
		type="file" 
		bind:this={fileInput}
		onchange={handleFileInputChange}
		class="file-input" 
		multiple 
	/>
</div>

{#if isUploading}
	<div class="upload-progress">
		<div class="progress-bar">
			<div class="progress-fill" style="width: {uploadProgress}%"></div>
		</div>
		<p class="progress-text">Uploading {uploadFileName}...</p>
	</div>
{/if}

<style>
	.upload-area {
		background: var(--color-surface);
		border: 2px dashed hsl(220, 15%, 30%);
		border-radius: var(--radius-lg);
		padding: var(--spacing-2xl);
		text-align: center;
		cursor: pointer;
		transition: all 0.3s ease;
		animation: fadeInUp 0.6s ease-out;
	}

	.upload-area:hover {
		border-color: var(--color-accent);
		background: var(--color-surface-hover);
	}

	.upload-area.drag-over {
		border-color: var(--color-accent);
		background: var(--color-surface-hover);
		box-shadow: var(--shadow-glow);
	}

	.upload-icon {
		width: 4rem;
		height: 4rem;
		margin: 0 auto var(--spacing-lg);
		color: var(--color-accent);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.upload-icon svg {
		width: 100%;
		height: 100%;
	}

	.upload-title {
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--color-text-primary);
		margin-bottom: var(--spacing-xs);
	}

	.upload-desc {
		color: var(--color-text-secondary);
		font-size: 0.875rem;
	}

	.file-input {
		display: none;
	}

	.upload-progress {
		margin-top: var(--spacing-lg);
		animation: fadeInUp 0.3s ease-out;
	}

	.progress-bar {
		width: 100%;
		height: 8px;
		background: var(--color-bg-tertiary);
		border-radius: 9999px;
		overflow: hidden;
		margin-bottom: var(--spacing-sm);
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, var(--color-accent), hsl(200, 85%, 65%));
		border-radius: 9999px;
		transition: width 0.3s ease;
	}

	.progress-text {
		text-align: center;
		color: var(--color-text-secondary);
		font-size: 0.875rem;
	}

	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
