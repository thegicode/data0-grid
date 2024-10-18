import Selection from "../Selection";
import DataModel from "../models/DataModel";

function copyCells(selection: Selection) {
    const { copiedCell, selectedCells } = selection;

    if (copiedCell.length > 0) {
        clearCopiedCell(selection);
    }

    const clipboardText =
        selectedCells.size === 1
            ? [...selectedCells][0].instance.value.toString()
            : selection.currentSelectionRange
                  .map((row) =>
                      row
                          .map((cell) =>
                              (
                                  cell as IHTMLTableCellElementWithInstance
                              ).instance.value.toString()
                          )
                          .join("\t")
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
) {
    navigator.clipboard
        .readText()
        .then((text) => {
            const [firstSelectedCell] = selection.selectedCells;
            const firstRow = Number(firstSelectedCell.dataset.row);
            const firstCol = Number(firstSelectedCell.dataset.col);
            const data = parseClipboardData(text);

            data.forEach((row, rowIndex) => {
                const targetRow = firstRow + rowIndex;

                const originData = dataModel.records.find(
                    (item) => item.id === getId(table, targetRow)
                ) as IDataItem;

                let parsedData = { ...originData };
                row.forEach((value, colIndex) => {
                    const targetCell = findTargetCell(
                        table,
                        targetRow,
                        firstCol + colIndex
                    ) as IHTMLTableCellElementWithInstance | null;

                    if (!targetCell || !targetCell.instance) return;

                    targetCell.instance.value = value;
                    if (value) {
                        const key = targetCell.instance.key as keyof IDataItem;

                        parsedData =
                            targetCell.instance.type === "string"
                                ? parsedData
                                : {
                                      ...parsedData,
                                      [key]: value.toString(),
                                  };
                    }

                    highlightCell(targetCell, selection.selectedCells);
                });

                if (parsedData && parsedData.id) {
                    dataModel.updateRecordFields(parsedData);
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
    cell: IHTMLTableCellElementWithInstance,
    selectedCells: Set<HTMLTableCellElement>
) {
    selectedCells.add(cell);
    cell.classList.add("selected");
}

function getId(table: HTMLTableElement, index: number) {
    const tr = table.querySelectorAll("tbody tr")[index] as HTMLElement;
    if (!tr) return null;
    return tr.dataset.id;
}

export default {
    copyCells,
    pasteCells,
};
