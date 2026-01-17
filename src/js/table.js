const csvFile = "./src/csv/data_indexed.csv";
const urlParams = new URLSearchParams(window.location.search);
const selectedLetter = urlParams.get("letter");

function loadTable() {
	console.log('Loading table...');
	console.log('Selected Letter:', selectedLetter);

	Papa.parse(csvFile, {
		download: true,
		header: true,
		skipEmptyLines: true,
		complete: function (results) {
			const cleanData = results.data.filter(
				(row) => row.TITEL && row.TITEL.trim() !== "",
			);

			if (selectedLetter) {
				renderFileLevel(cleanData, selectedLetter.toUpperCase());
			} else {
				renderAlphabetLevel(cleanData);
			}
		},
		error: function (err) {
			document.getElementById("table-container").innerHTML =
				`<p>Error loading CSV: ${err}</p>`;
		},
	});
}

function renderAlphabetLevel(data) {
    const letters = [
        ...new Set(data.map((row) => row.TITEL.trim().charAt(0).toUpperCase())),
    ].sort();

    let html =
        "<table><thead><tr><th>Name</th><th>Items Count</th></tr></thead><tbody>";

    // All row
    html += `<tr><td class="folder-icon"><a href="?letter=all">All</a></td><td>${data.length} items</td></tr>`;

    letters.forEach((letter) => {
        const count = data.filter((row) =>
            row.TITEL.trim().toUpperCase().startsWith(letter),
        ).length;
        html += `<tr><td class="folder-icon"><a href="?letter=${letter}">${letter}</a></td><td>${count} items</td></tr>`;
    });

    html += "</tbody></table>";
    document.getElementById("table-container").innerHTML = html;
}

function renderFileLevel(data, letter) {
    const isAllView = letter === "ALL";
    const dirTitle = isAllView ? "All" : letter;

    const filteredData = isAllView
        ? data
        : data.filter((row) => row.TITEL.trim().toUpperCase().startsWith(letter));
    const headers = Object.keys(filteredData[0]).filter((h) => h !== "#id" && h !== "﻿image" && h !== "__parsed_extra" && h !== "bron?");

    let html = "<table><thead><tr>";
    headers.forEach((h) => (html += `<th>${h}</th>`));
    html += "</tr></thead><tbody>";
    
    // Letter row
    html += "<tr>";
    html += `<td id="letter"><strong>${dirTitle}</strong></td>`;
    for (let i = 1; i < headers.length; i++) {
        html += "<td></td>";
    }
    html += "</tr>";

    filteredData.forEach((row) => {
        html += "<tr>";
        headers.forEach((h, index) => {
            let content = row[h] ? row[h].toString().trim() : "";
            if (content === "") content = "-";

            const iconClass = index === 0 ? 'class="file-icon"' : "";
            html += `<td ${iconClass}>${content}</td>`;
        });
        html += "</tr>";
    });

    html += "</tbody></table>";
    document.getElementById("table-container").innerHTML = html;
}

window.onload = loadTable;
