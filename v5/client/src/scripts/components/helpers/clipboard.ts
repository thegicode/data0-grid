import Selection from "../Selection";
import DataModel from "../models/DataModel";

function copyCells(selection: Selection): void {
    const { copiedCell, selectedCells } = selection;

    if (copiedCell.length > 0) {
        clearCopiedCell(selection);
    }

    const clipboardText =
        selectedCells.size === 1
            ? [...selectedCells][0].instance.value
            : selection.currentSelectionRange
                  .map((row) =>
                      row.map((cell) => (cell as any).instance.value).join("\t")
                  )
                  .join("\n");

    navigator.clipboard
        .writeText(clipboardText)
        .then(() => console.log("Data copied to clipboard"))
        .catch((err) =>
            console.error("Failed to copy data to clipboard: ", err)
        );

    selectedCells.forEach((cell) => cell.classList.add("copiedCell"));
    selection.copiedCell = [...selectedCells];
}

function clearCopiedCell(selection: Selection): void {
    selection.copiedCell.forEach((cell) => cell.classList.remove("copiedCell"));
    selection.copiedCell = [];
}

function pasteCells(
    table: HTMLTableElement,
    dataModel: DataModel,
    selection: Selection
): void {
    clearCopiedCell(selection);

    navigator.clipboard
        .readText()
        .then((text) => {
            const [firstSelectedCell] = selection.selectedCells;
            const firstRow = Number(firstSelectedCell.dataset.row);
            const firstCol = Number(firstSelectedCell.dataset.col);
            const data = parseClipboardData(text);

            data.forEach((row, rowIndex) => {
                const targetRow = firstRow + rowIndex;
                const pastedData: any = { id: getRowId(table, targetRow) };

                row.forEach((value, colIndex) => {
                    const targetCell = findTargetCell(
                        table,
                        targetRow,
                        firstCol + colIndex
                    ) as HTMLTableCellElement | null;

                    if (!targetCell || !(targetCell as any).instance) return;

                    (targetCell as any).instance.value = value;
                    const parsedValue = (targetCell as any).instance.value;

                    if (parsedValue) {
                        pastedData[(targetCell as any).instance.key] =
                            parsedValue;
                    }

                    highlightCell(targetCell, selection.selectedCells);
                });

                if (pastedData.id) {
                    dataModel.updateRecordFields(pastedData);
                }
            });
        })
        .catch((err) =>
            console.error("Failed to read clipboard contents: ", err)
        );
}

function parseClipboardData(text: string): string[][] {
    return text.split("\n").map((row) => row.split("\t"));
}

function findTargetCell(
    table: HTMLTableElement,
    row: number,
    col: number
): HTMLTableCellElement | null {
    return table.querySelector(
        `tbody td[data-row="${row}"][data-col="${col}"]`
    );
}

function highlightCell(
    cell: HTMLTableCellElement,
    selectedCells: Set<HTMLTableCellElement>
): void {
    selectedCells.add(cell);
    cell.classList.add("selected");
}

function getRowId(table: HTMLTableElement, index: number): string | null {
    const tr = table.querySelectorAll("tbody tr")[index] as HTMLElement; // tr을 HTMLElement로 캐스팅
    const td = tr?.querySelector("td[data-id]") as HTMLElement; // td를 HTMLElement로 캐스팅
    return td?.dataset.id || null; // dataset 속성을 안전하게 접근
}

export default {
    copyCells,
    pasteCells,
};
