export function onCsvButtonClick(selectedCells, gridElement, csvButton) {
    console.log("onCsvButtonClick");
    // Convert selectedCells to an array and sort by row and column
    const sortedCells = [...selectedCells].sort((a, b) => {
        const aRow = parseInt(a.dataset.row);
        const aCol = parseInt(a.dataset.col);
        const bRow = parseInt(b.dataset.row);
        const bCol = parseInt(b.dataset.col);

        if (aRow === bRow) {
            return aCol - bCol;
        }
        return aRow - bRow;
    });

    // Create a 2D array to store the clipboard data and keep track of non-empty columns
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

    // Filter out empty rows
    const filteredRows = rows.filter(
        (row) => row !== undefined && row.some((cell) => cell !== undefined)
    );

    // Convert the 2D array to CSV text and include row header numbers
    const csvRows = filteredRows.map((row, rowIndex) =>
        [
            rowIndex + 1,
            ...Array.from(selectedCols)
                .sort((a, b) => a - b)
                .map((col) => row[col] || ""),
        ].join(",")
    );

    // Add headers to CSV text based on selected columns
    const headers = Array.from(
        gridElement.querySelectorAll("thead th .name")
    ).map((th) => th.textContent);
    const selectedHeaders = [
        "Row Number",
        ...Array.from(selectedCols)
            .sort((a, b) => a - b)
            .map((colIndex) => headers[colIndex]),
    ]; // +1 to account for row header

    const csvText = [selectedHeaders.join(","), ...csvRows].join("\n");

    downloadCSV(csvText, "data.csv");

    csvButton.hidden = true;
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

const getInputValue = (cell) => {
    const inputElement =
        cell.querySelector("input") || cell.querySelector("select");
    if (inputElement.type === "checkbox") {
        return inputElement.checked ? "true" : "false";
    } else {
        return inputElement.value;
    }
};
