<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		message: string;
		type: 'success' | 'error' | 'warning';
		onClose: () => void;
	}

	let { message, type, onClose }: Props = $props();

	let visible = $state(true);

	onMount(() => {
		// Trigger fade in animation
		setTimeout(() => {
			visible = true;
		}, 10);
	});

	function close() {
		visible = false;
		setTimeout(() => {
			onClose();
		}, 300);
	}

	function getToastIcon(type: 'success' | 'error' | 'warning'): string {
		const icons = {
			success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
				<polyline points="22 4 12 14.01 9 11.01"/>
			</svg>`,
			error: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<circle cx="12" cy="12" r="10"/>
				<line x1="15" y1="9" x2="9" y2="15"/>
				<line x1="9" y1="9" x2="15" y2="15"/>
			</svg>`,
			warning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
				<line x1="12" y1="9" x2="12" y2="13"/>
				<line x1="12" y1="17" x2="12.01" y2="17"/>
			</svg>`,
		};
		return icons[type];
	}
</script>

<div class="toast {type}" class:visible>
	<div class="toast-icon">
		{@html getToastIcon(type)}
	</div>
	<div class="toast-message">{message}</div>
	<button class="toast-close" onclick={close} aria-label="Close notification">
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			<line x1="18" y1="6" x2="6" y2="18"/>
			<line x1="6" y1="6" x2="18" y2="18"/>
		</svg>
	</button>
</div>

<style>
	.toast {
		display: flex;
		align-items: center;
		gap: var(--spacing-md);
		background: var(--color-surface);
		border: 1px solid hsl(220, 15%, 25%);
		border-radius: var(--radius-md);
		padding: var(--spacing-md) var(--spacing-lg);
		box-shadow: var(--shadow-lg);
		min-width: 320px;
		max-width: 480px;
		opacity: 0;
		transform: translateX(100%);
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.toast.visible {
		opacity: 1;
		transform: translateX(0);
	}

	.toast-icon {
		flex-shrink: 0;
		width: 1.5rem;
		height: 1.5rem;
	}

	.toast-icon :global(svg) {
		width: 100%;
		height: 100%;
	}

	.toast.success {
		border-color: var(--color-success);
	}

	.toast.success .toast-icon {
		color: var(--color-success);
	}

	.toast.error {
		border-color: var(--color-error);
	}

	.toast.error .toast-icon {
		color: var(--color-error);
	}

	.toast.warning {
		border-color: var(--color-warning);
	}

	.toast.warning .toast-icon {
		color: var(--color-warning);
	}

	.toast-message {
		flex: 1;
		color: var(--color-text-primary);
		font-size: 0.875rem;
	}

	.toast-close {
		flex-shrink: 0;
		background: none;
		border: none;
		color: var(--color-text-tertiary);
		cursor: pointer;
		padding: 0;
		width: 1.25rem;
		height: 1.25rem;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: color 0.2s ease;
	}

	.toast-close:hover {
		color: var(--color-text-primary);
	}

	.toast-close svg {
		width: 100%;
		height: 100%;
	}
</style>
