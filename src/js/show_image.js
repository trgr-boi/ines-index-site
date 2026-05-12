// Image overlay functionality
let currentImageData = null;
let hoverTimeout = null;

// Create overlay elements
const imagePreview = document.createElement("div");
imagePreview.id = "image-preview";
imagePreview.className = "image-preview";

const imageModal = document.createElement("div");
imageModal.id = "image-modal";
imageModal.className = "image-modal hidden";

const modalContent = document.createElement("div");
modalContent.className = "modal-content";

const closeBtn = document.createElement("button");
closeBtn.className = "modal-close";
closeBtn.textContent = "✕";

imageModal.appendChild(modalContent);
imageModal.appendChild(closeBtn);
document.body.appendChild(imagePreview);
document.body.appendChild(imageModal);

// Close modal on close button click
closeBtn.addEventListener("click", closeModal);

// Close modal on background click
imageModal.addEventListener("click", (e) => {
	if (e.target === imageModal) {
		closeModal();
	}
});

// Close modal on Escape key
document.addEventListener("keydown", (e) => {
	if (e.key === "Escape") {
		closeModal();
	}
});

function showImagePreview(imagePath, event) {
	if (!imagePath || imagePath === "-") return;

	hoverTimeout = setTimeout(() => {
		const img = new Image();
		img.onload = () => {
			imagePreview.innerHTML = `<img src="${imagePath}" alt="Preview">`;
			imagePreview.style.display = "block";
			imagePreview.offsetHeight;
			imagePreview.classList.add("visible");
		};
		img.onerror = () => {
			imagePreview.innerHTML = `<div class="no-image">no image</div>`;
			imagePreview.style.display = "block";
			imagePreview.offsetHeight;
			imagePreview.classList.add("visible");
		};
		img.src = imagePath;
	}, 300);
}

function positionPreviewBottomLeft() {
	imagePreview.style.left = "20px";
	imagePreview.style.bottom = "20px";
	imagePreview.style.top = "auto";
}

function hideImagePreview() {
	clearTimeout(hoverTimeout);
	imagePreview.classList.remove("visible");
	setTimeout(() => {
		imagePreview.style.display = "none";
		imagePreview.innerHTML = "";
	}, 300);
}

function checkImageExists(imagePath) {
	return new Promise((resolve) => {
		if (!imagePath || imagePath === "-") {
			resolve(false);
			return;
		}
		const img = new Image();
		img.onload = () => resolve(true);
		img.onerror = () => resolve(false);
		img.src = imagePath;
	});
}

function buildModalDataHTML(rowData) {
	if (!rowData) return "";
	const fields = [
		["TITLE", "Title"],
		["ISSUE NUMBER", "Issue"],
		["AUTHOR(S)", "Author(s)"],
		["TYPE", "Type"],
		["PLACE", "Place"],
		["YEAR", "Year"],
		["DESCRIPTION", "Description"],
		["PUBLISHER", "Publisher"],
		["PRINT DETAILS", "Print Details"],
	];
	let html = '<div class="modal-data">';
	fields.forEach(([key, label]) => {
		const val = (rowData[key] || "").trim();
		if (val) {
			html += `<div class="modal-data-row"><span class="modal-data-label">${label}</span><span class="modal-data-value">${val}</span></div>`;
		}
	});
	html += "</div>";
	return html;
}

function openImageModal(imagePath, rowData) {
	if (!imagePath || imagePath === "-") return;

	modalContent.innerHTML = "";

	const wrapper = document.createElement("div");
	wrapper.className = "modal-inner";

	// Image panel (left)
	const imagePanel = document.createElement("div");
	imagePanel.className = "modal-image-panel";

	const img = new Image();

	// Data panel (right)
	const dataPanel = document.createElement("div");
	dataPanel.className = "modal-data-panel";
	dataPanel.innerHTML = buildModalDataHTML(rowData);

	img.onload = () => {
		imagePanel.appendChild(img);
	};
	img.onerror = () => {
		const noImageDiv = document.createElement("div");
		noImageDiv.className = "no-image modal-no-image";
		noImageDiv.textContent = "no image";
		imagePanel.appendChild(noImageDiv);
	};
	img.src = imagePath;
	img.className = "modal-image";

	wrapper.appendChild(imagePanel);
	wrapper.appendChild(dataPanel);
	modalContent.appendChild(wrapper);
	modalContent.appendChild(closeBtn);

	imageModal.classList.remove("hidden");
	imageModal.offsetHeight;
	imageModal.classList.add("visible");
}

function closeModal() {
	imageModal.classList.remove("visible");
	setTimeout(() => {
		imageModal.classList.add("hidden");
		modalContent.innerHTML = "";
	}, 300);
}

// Add event listeners to table rows
function initImagePreview() {
	const observer = new MutationObserver(async () => {
		const rows = document.querySelectorAll("table tbody tr:not(.letter-row)");

		for (const row of rows) {
			if (row.dataset.imageListenerAdded) continue;
			row.dataset.imageListenerAdded = "true";

			if (row.dataset.imagePath) {
				const imageExists = await checkImageExists(row.dataset.imagePath);

				if (imageExists) {
					row.style.cursor = "pointer";
					row.addEventListener("mouseenter", () => {
						positionPreviewBottomLeft();
						showImagePreview(row.dataset.imagePath);
					});

					row.addEventListener("mouseleave", hideImagePreview);

					row.addEventListener("click", () => {
						let rowData = null;
						if (row.dataset.row) {
							try {
								rowData = JSON.parse(row.dataset.row);
							} catch (e) {
								rowData = null;
							}
						}
						openImageModal(row.dataset.imagePath, rowData);
					});
				}
			}
		}

		if (rows.length > 0) {
			observer.disconnect();
		}
	});

	const tableContainer = document.getElementById("table-container");
	observer.observe(tableContainer, { childList: true, subtree: true });
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initImagePreview);
} else {
	initImagePreview();
}
