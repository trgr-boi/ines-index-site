const jsonFile = "src/data/data.json";

let allData = [];

// Modal elements
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
document.body.appendChild(imageModal);

closeBtn.addEventListener("click", closeModal);
imageModal.addEventListener("click", (e) => {
	if (e.target === imageModal) closeModal();
});
document.addEventListener("keydown", (e) => {
	if (e.key === "Escape") closeModal();
});

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

function loadImageGrid() {
	fetch(jsonFile)
		.then((response) => {
			if (!response.ok) throw new Error("JSON not found");
			return response.json();
		})
		.then((data) => {
			allData = data.filter(
				(row) => row.TITLE && row.TITLE.trim() !== ""
			);
			renderImageGrid();
		})
		.catch((err) => {
			document.getElementById("images-container").innerHTML =
				`<p>Error loading data: ${err}</p>`;
		});
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

function renderImageGrid() {
	const container = document.getElementById("images-container");

	// Sort by title
	const sorted = [...allData].sort((a, b) => a.TITLE.localeCompare(b.TITLE));

	let html = '<div class="images-grid">';
	sorted.forEach((row) => {
		const imagePath = row.IMAGE ? row.IMAGE.toString().trim() : "";
		if (!imagePath) return;

		const title = row.TITLE || "";
		const id = row.ID || "";

		html += `<div class="image-card" data-image-path="${imagePath}" data-id="${id}">`;
		html += `<div class="image-card-img">`;
		html += `<img src="${imagePath}" alt="${title}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\'no-image card-no-image\'>no image</div>'" />`;
		html += `</div>`;
		html += `<div class="image-card-title">${title}</div>`;
		html += `</div>`;
	});
	html += "</div>";

	container.innerHTML = html;

	// Add click listeners
	container.querySelectorAll(".image-card").forEach((card) => {
		card.addEventListener("click", () => {
			const id = card.dataset.id;
			const rowData = allData.find((r) => r.ID === id);
			const imagePath = card.dataset.imagePath;
			openImageModal(imagePath, rowData);
		});
	});
}

window.onload = loadImageGrid;
