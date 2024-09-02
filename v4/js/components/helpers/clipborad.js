function copyCells(selection) {
    const { selectedCells } = selection;
    const clipboardText =
        selectedCells.size === 1
            ? getInputValue([...selectedCells][0])
            : selection.currentSelectionRange
                  .map((row) =>
                      row.map((cell) => getInputValue(cell)).join("\t")
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

function getInputValue(cell) {
    const dataCell = cell.instance.dataCell;
    if (dataCell) return dataCell.value;
    return null;
}

function pasteCells(table, dataModel, selection) {
    selection.copiedCell.forEach((cell) => cell.classList.remove("copiedCell"));
    selection.copiedCell = [];

    navigator.clipboard
        .readText()
        .then((text) => {
            const [firstSelectedCell] = selection.selectedCells;
            const firstRow = Number(firstSelectedCell.dataset.row);
            const firstCol = Number(firstSelectedCell.dataset.col);
            const data = parseClipboardData(text);

            data.forEach((row, rowIndex) => {
                const targetRow = firstRow + rowIndex;
                const pastedData = { id: getRowId(table, targetRow) };

                row.forEach((value, colIndex) => {
                    const targetCell = findTargetCell(
                        table,
                        targetRow,
                        firstCol + colIndex
                    );
                    if (!targetCell) return;

                    const dataCell = targetCell.instance.dataCell;
                    if (!dataCell) return;

                    dataCell.value = value;

                    const parsedValue = dataCell.value;

                    if (parsedValue) {
                        const propTitle = getTitle(table, firstCol + colIndex);
                        pastedData[propTitle] = parsedValue;
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

function parseClipboardData(text) {
    return text.split("\n").map((row) => row.split("\t"));
}

function findTargetCell(table, row, col) {
    return table.querySelector(
        `tbody td[data-row="${row}"][data-col="${col}"]`
    );
}

function highlightCell(cell, selectedCells) {
    selectedCells.add(cell);
    cell.classList.add("selected");
}

function getRowId(table, index) {
    const tr = table.querySelectorAll("tbody tr")[index];
    return tr?.querySelector("td[data-id]")?.dataset.id || null;
}

function getTitle(table, col) {
    const th = table.querySelector("thead").querySelectorAll("th")[col + 1];
    return th ? th.textContent : null;
}

export default {
    copyCells,
    pasteCells,
};
