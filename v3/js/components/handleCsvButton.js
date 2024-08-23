function onCsvButtonClick(selection, csvButton) {
    const sortedCells = sortSelectedCells(selection.selectedCells);

    const { rows, selectedCols } = organizeSelectedCells(sortedCells);

    const filteredRows = filterEmptyRows(rows);

    const csvText = convertToCsv(filteredRows, selectedCols, this);

    downloadCSV(csvText, "data.csv");

    csvButton.hidden = true;
}

function sortSelectedCells(selectedCells) {
    return [...selectedCells].sort((a, b) => {
        const aRow = parseInt(a.dataset.row);
        const aCol = parseInt(a.dataset.col);
        const bRow = parseInt(b.dataset.row);
        const bCol = parseInt(b.dataset.col);

        return aRow === bRow ? aCol - bCol : aRow - bRow;
    });
}

function organizeSelectedCells(sortedCells) {
    const rows = [];
    const selectedCols = new Set();

    sortedCells.forEach((cell) => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        const value = getInputValue(cell);

        if (!rows[row]) {
            rows[row] = [];
        }

        if (value !== "") {
            rows[row][col] = value;
            selectedCols.add(col);
        }
    });

    return { rows, selectedCols };
}

function filterEmptyRows(rows) {
    return rows.filter(
        (row) => row !== undefined && row.some((cell) => cell !== undefined)
    );
}

function convertToCsv(filteredRows, selectedCols, dataGrid) {
    const headers = extractHeaders(selectedCols, dataGrid);
    const csvRows = filteredRows.map((row, rowIndex) =>
        [
            rowIndex + 1,
            ...Array.from(selectedCols)
                .sort((a, b) => a - b)
                .map((col) => row[col] || ""),
        ].join(",")
    );

    return [headers.join(","), ...csvRows].join("\n");
}

function extractHeaders(selectedCols, dataGrid) {
    const headers = Array.from(dataGrid.querySelectorAll("thead th")).map(
        (th) => th.textContent
    );
    return [
        "",
        ...Array.from(selectedCols)
            .sort((a, b) => a - b)
            .map((colIndex) => headers[colIndex + 1]),
    ];
}

function downloadCSV(csv, filename) {
    const csvFile = new Blob([csv], { type: "text/csv" });
    const downloadLink = document.createElement("a");

    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);

    downloadLink.click();
    document.body.removeChild(downloadLink);
}

function getInputValue(cell) {
    const inputElement =
        cell.querySelector("input") || cell.querySelector("select");
    return inputElement.type === "checkbox"
        ? inputElement.checked
            ? "true"
            : "false"
        : inputElement.value;
}

export default { onCsvButtonClick };
