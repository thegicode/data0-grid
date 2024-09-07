function copyCells(selection) {
    const { copiedCell, selectedCells } = selection;

    if (copiedCell.length > 0) {
        clearCopiedCell(selection);
    }

    const clipboardText =
        selectedCells.size === 1
            ? [...selectedCells][0].instance.value
            : selection.currentSelectionRange
                  .map((row) =>
                      row.map((cell) => cell.instance.value).join("\t")
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

function clearCopiedCell(selection) {
    selection.copiedCell.forEach((cell) => cell.classList.remove("copiedCell"));
    selection.copiedCell = [];
}

function pasteCells(table, dataModel, selection) {
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
                const pastedData = { id: getRowId(table, targetRow) };

                row.forEach((value, colIndex) => {
                    const targetCell = findTargetCell(
                        table,
                        targetRow,
                        firstCol + colIndex
                    );
                    if (!targetCell || !targetCell.instance) return;

                    targetCell.instance.value = value;

                    const parsedValue = targetCell.instance.value;

                    if (parsedValue) {
                        pastedData[targetCell.instance.key] = parsedValue;
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

export default {
    copyCells,
    pasteCells,
};
