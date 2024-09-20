import DataGrid from "../DataGrid";
import Selection from "../Selection";

function onCsvButtonClick(
    this: DataGrid,
    selection: Selection,
    csvButton: HTMLButtonElement
) {
    const sortedCells = sortSelectedCells(selection.selectedCells);

    const { rows, selectedCols } = organizeSelectedCells(sortedCells);

    const filteredRows = filterEmptyRows(rows);

    const csvText = convertToCsv(filteredRows, selectedCols, this);

    downloadCSV(csvText, "data.csv");

    csvButton.hidden = true;
}

function sortSelectedCells(
    selectedCells: Set<IHTMLTableCellElementWithInstance>
) {
    return [...selectedCells].sort((a, b) => {
        const aRow = a.instance.row;
        const aCol = a.instance.col;
        const bRow = b.instance.row;
        const bCol = b.instance.col;

        return aRow === bRow ? aCol - bCol : aRow - bRow;
    });
}

function organizeSelectedCells(
    sortedCells: IHTMLTableCellElementWithInstance[]
) {
    const rows: string[][] = [];
    const selectedCols = new Set<number>();

    sortedCells.forEach((cell) => {
        const row = cell.instance.row;
        const col = cell.instance.col;
        let value: string | boolean = cell.instance.value;

        if (cell.instance.type === "checkbox") {
            // value가 boolean이면 true/false를 문자열로 변환

            if (typeof value === "boolean") {
                value = value ? "true" : "false";
            }

            // value가 "on"이면 "true", 그 외는 "false"로 처리
            else if (value === "true" || value === "on") {
                value = "true";
            } else {
                value = "false";
            }
        }

        // if (value === false || value === "") {
        //     value = "false";
        // } else if (value === true || value === "on") {
        //     value = "true";
        // }

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
