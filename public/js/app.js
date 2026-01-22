// public/js/app.ts
var elements = {
  uploadArea: document.getElementById("uploadArea"),
  fileInput: document.getElementById("fileInput"),
  uploadProgress: document.getElementById("uploadProgress"),
  progressFill: document.getElementById("progressFill"),
  progressText: document.getElementById("progressText"),
  filesList: document.getElementById("filesList"),
  emptyState: document.getElementById("emptyState"),
  refreshBtn: document.getElementById("refreshBtn"),
  toastContainer: document.getElementById("toastContainer")
};
async function init() {
  setupEventListeners();
  await loadFiles();
}
function setupEventListeners() {
  elements.fileInput.addEventListener("change", handleFileSelect);
  elements.uploadArea.addEventListener("click", () => {
    elements.fileInput.click();
  });
  elements.uploadArea.addEventListener("dragover", handleDragOver);
  elements.uploadArea.addEventListener("dragleave", handleDragLeave);
  elements.uploadArea.addEventListener("drop", handleDrop);
  elements.refreshBtn.addEventListener("click", async () => {
    await loadFiles();
    showToast("Files refreshed", "success");
  });
}
async function handleFileSelect(event) {
  const input = event.target;
  if (!input.files || input.files.length === 0)
    return;
  await uploadFiles(Array.from(input.files));
  input.value = "";
}
function handleDragOver(event) {
  event.preventDefault();
  elements.uploadArea.classList.add("drag-over");
}
function handleDragLeave() {
  elements.uploadArea.classList.remove("drag-over");
}
async function handleDrop(event) {
  event.preventDefault();
  elements.uploadArea.classList.remove("drag-over");
  const files = event.dataTransfer?.files;
  if (!files || files.length === 0)
    return;
  await uploadFiles(Array.from(files));
}
async function uploadFiles(files) {
  for (const file of files) {
    await uploadFile(file);
  }
}
async function uploadFile(file) {
  try {
    elements.uploadProgress.style.display = "block";
    elements.progressFill.style.width = "0%";
    elements.progressText.textContent = `Uploading ${file.name}...`;
    animateProgress(0, 90, 500);
    const formData = new FormData;
    formData.append("file", file);
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData
    });
    const result = await response.json();
    animateProgress(90, 100, 100);
    if (result.success) {
      showToast(result.message, "success");
      await loadFiles();
    } else {
      showToast(result.message || result.error || "Upload failed", response.status === 409 ? "warning" : "error");
    }
  } catch (error) {
    console.error("Upload error:", error);
    showToast("Failed to upload file", "error");
  } finally {
    setTimeout(() => {
      elements.uploadProgress.style.display = "none";
    }, 1000);
  }
}
function animateProgress(from, to, duration) {
  const start = Date.now();
  const tick = () => {
    const elapsed = Date.now() - start;
    const progress = Math.min(elapsed / duration, 1);
    const value = from + (to - from) * progress;
    elements.progressFill.style.width = `${value}%`;
    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  };
  requestAnimationFrame(tick);
}
async function loadFiles() {
  try {
    const response = await fetch("/api/files");
    const data = await response.json();
    if (data.files.length === 0) {
      elements.filesList.innerHTML = "";
      elements.emptyState.classList.add("visible");
      return;
    }
    elements.emptyState.classList.remove("visible");
    renderFiles(data.files);
  } catch (error) {
    console.error("Load files error:", error);
    showToast("Failed to load files", "error");
  }
}
function renderFiles(files) {
  elements.filesList.innerHTML = files.map((file) => createFileCard(file)).join("");
  files.forEach((file) => {
    const downloadBtn = document.getElementById(`download-${encodeKey(file.key)}`);
    const deleteBtn = document.getElementById(`delete-${encodeKey(file.key)}`);
    downloadBtn?.addEventListener("click", () => downloadFile(file));
    deleteBtn?.addEventListener("click", () => deleteFile(file));
  });
}
function createFileCard(file) {
  const encodedKey = encodeKey(file.key);
  const formattedSize = formatBytes(file.size);
  const formattedDate = formatDate(file.uploadedAt);
  return `
		<div class="file-card">
			<div class="file-icon">
				${getFileIcon(file.contentType)}
			</div>
			<div class="file-info">
				<div class="file-name" title="${escapeHtml(file.name)}">${escapeHtml(file.name)}</div>
				<div class="file-meta">
					<span class="file-meta-item">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
						</svg>
						${formattedSize}
					</span>
					<span class="file-meta-item">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<circle cx="12" cy="12" r="10"/>
							<polyline points="12 6 12 12 16 14"/>
						</svg>
						${formattedDate}
					</span>
					<span class="file-meta-item" title="SHA-256: ${file.checksum}">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
							<path d="M7 11V7a5 5 0 0 1 10 0v4"/>
						</svg>
						${file.checksum.substring(0, 8)}...
					</span>
				</div>
			</div>
			<div class="file-actions">
				<button class="btn btn-primary" id="download-${encodedKey}" aria-label="Download ${escapeHtml(file.name)}">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
						<polyline points="7 10 12 15 17 10"/>
						<line x1="12" y1="15" x2="12" y2="3"/>
					</svg>
					Download
				</button>
				<button class="btn btn-danger" id="delete-${encodedKey}" aria-label="Delete ${escapeHtml(file.name)}">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<polyline points="3 6 5 6 21 6"/>
						<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
					</svg>
					Delete
				</button>
			</div>
		</div>
	`;
}
async function downloadFile(file) {
  try {
    const url = `/api/files/${encodeURIComponent(file.key)}`;
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Downloading ${file.name}`, "success");
  } catch (error) {
    console.error("Download error:", error);
    showToast("Failed to download file", "error");
  }
}
async function deleteFile(file) {
  if (!confirm(`Are you sure you want to delete "${file.name}"?`)) {
    return;
  }
  try {
    const response = await fetch(`/api/files/${encodeURIComponent(file.key)}`, {
      method: "DELETE"
    });
    const result = await response.json();
    if (result.success) {
      showToast("File deleted successfully", "success");
      await loadFiles();
    } else {
      showToast(result.error || "Failed to delete file", "error");
    }
  } catch (error) {
    console.error("Delete error:", error);
    showToast("Failed to delete file", "error");
  }
}
function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `
		<div class="toast-icon">
			${getToastIcon(type)}
		</div>
		<div class="toast-message">${escapeHtml(message)}</div>
	`;
  elements.toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 5000);
}
function getToastIcon(type) {
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
		</svg>`
  };
  return icons[type];
}
function getFileIcon(contentType) {
  if (contentType.startsWith("image/")) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
			<circle cx="8.5" cy="8.5" r="1.5"/>
			<polyline points="21 15 16 10 5 21"/>
		</svg>`;
  }
  if (contentType.startsWith("video/")) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			<polygon points="23 7 16 12 23 17 23 7"/>
			<rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
		</svg>`;
  }
  if (contentType.startsWith("audio/")) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			<path d="M9 18V5l12-2v13"/>
			<circle cx="6" cy="18" r="3"/>
			<circle cx="18" cy="16" r="3"/>
		</svg>`;
  }
  if (contentType.includes("pdf")) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
			<polyline points="14 2 14 8 20 8"/>
			<line x1="16" y1="13" x2="8" y2="13"/>
			<line x1="16" y1="17" x2="8" y2="17"/>
			<polyline points="10 9 9 9 8 9"/>
		</svg>`;
  }
  if (contentType.includes("zip") || contentType.includes("rar") || contentType.includes("archive")) {
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
function formatBytes(bytes) {
  if (bytes === 0)
    return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}
function formatDate(isoDate) {
  const date = new Date(isoDate);
  const now = new Date;
  const diffMs = now.getTime() - date.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  if (diffHours < 1) {
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    return `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago`;
  }
  if (diffHours < 24) {
    return `${Math.floor(diffHours)} hour${Math.floor(diffHours) !== 1 ? "s" : ""} ago`;
  }
  if (diffHours < 48) {
    return "Yesterday";
  }
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
function encodeKey(key) {
  return btoa(key).replace(/[+/=]/g, (m) => {
    return { "+": "-", "/": "_", "=": "" }[m] || m;
  });
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
