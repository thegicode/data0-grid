import DataGrid from "../DataGrid";
import Selection from "../Selection";

function onCsvButtonClick(selection: Selection, csvButton: HTMLButtonElement) {
    const sortedCells = sortSelectedCells(selection.selectedCells);

    const { rows, selectedCols } = organizeSelectedCells(sortedCells);

    const filteredRows = filterEmptyRows(rows);

    const csvText = convertToCsv(filteredRows, selectedCols, this as DataGrid);

    downloadCSV(csvText, "data.csv");

    csvButton.hidden = true;
}

function sortSelectedCells(selectedCells: Set<HTMLTableCellElement>) {
    return [...selectedCells].sort((a, b) => {
        const aRow = parseInt((a as any).instance.row);
        const aCol = parseInt((a as any).instance.col);
        const bRow = parseInt((b as any).instance.row);
        const bCol = parseInt((b as any).instance.col);

        return aRow === bRow ? aCol - bCol : aRow - bRow;
    });
}

function organizeSelectedCells(sortedCells: HTMLTableCellElement[]): {
    rows: string[][];
    selectedCols: Set<number>;
} {
    const rows: string[][] = [];
    const selectedCols = new Set<number>();

    sortedCells.forEach((cell) => {
        const row = parseInt((cell as any).instance.row);
        const col = parseInt((cell as any).instance.col);
        let value = (cell as any).instance.value;

        if ((cell as any).instance.type === "checkbox") {
            if (value === false || value === "") {
                value = "false";
            }
            if (value === true || value === "on") {
                value = "true";
            }
        }

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

function filterEmptyRows(rows: string[][]): string[][] {
    return rows.filter(
        (row) => row !== undefined && row.some((cell) => cell !== undefined)
    );
}

function convertToCsv(
    filteredRows: string[][],
    selectedCols: Set<number>,
    dataGrid: DataGrid
): string {
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

function extractHeaders(
    selectedCols: Set<number>,
    dataGrid: DataGrid
): string[] {
    const headers = Array.from(dataGrid.querySelectorAll("thead th")).map(
        (th) => th.textContent || ""
    );
    return [
        "",
        ...Array.from(selectedCols)
            .sort((a, b) => a - b)
            .map((colIndex) => headers[colIndex + 1]),
    ];
}

function downloadCSV(csv: string, filename: string): void {
    const csvFile = new Blob([csv], { type: "text/csv" });
    const downloadLink = document.createElement("a");

    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);

    downloadLink.click();
    document.body.removeChild(downloadLink);
}

export default { onCsvButtonClick };
