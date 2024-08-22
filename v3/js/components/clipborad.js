let clipboardData = [];

function copyCells(selectedCells, currentSelectionRange) {
    const clipboardText =
        selectedCells.size === 1
            ? getInputValue([...selectedCells][0])
            : currentSelectionRange
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
}

function getInputValue(cell) {
    const inputElement =
        cell.querySelector("input") || cell.querySelector("select");
    return inputElement?.type === "checkbox"
        ? inputElement.checked
        : inputElement.value;
}

function pasteCells(selectedCells, tbody, manager) {
    navigator.clipboard
        .readText()
        .then((text) => {
            const [firstSelectedCell] = selectedCells;
            const firstRow = Number(firstSelectedCell.dataset.row);
            const firstCol = Number(firstSelectedCell.dataset.col);
            const data = parseClipboardData(text);

            data.forEach((row, rowIndex) => {
                const targetRow = firstRow + rowIndex;
                const pastedData = { id: getRowId(targetRow) };

                row.forEach((value, colIndex) => {
                    const targetCell = findTargetCell(
                        tbody,
                        targetRow,
                        firstCol + colIndex
                    );
                    if (!targetCell) return;

                    const input =
                        targetCell.querySelector("input") ||
                        targetCell.querySelector("select");
                    if (!input) return;

                    const parsedValue = handleInputPaste(input, value);
                    if (parsedValue) {
                        const propTitle = getTitle(firstCol + colIndex);
                        pastedData[propTitle] = parsedValue;
                    }

                    highlightCell(targetCell, selectedCells);
                });

                if (pastedData.id) {
                    manager.updateRecordFields(pastedData);
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

function findTargetCell(tbody, row, col) {
    return tbody.querySelector(`td[data-row="${row}"][data-col="${col}"]`);
}

function highlightCell(cell, selectedCells) {
    selectedCells.add(cell);
    cell.classList.add("selected");
}

function handleInputPaste(input, value) {
    switch (input.dataset.type) {
        case "number":
            return pasteNumberInput(input, value);
        case "checkbox":
            return pasteCheckboxInput(input, value);
        case "select":
            return updateSelectInput(input, value);
        case "datalist":
            return updateDatalistInput(input, value);
        default:
            input.value = value;
            return value;
    }
}

function pasteNumberInput(input, value) {
    if (!isNaN(value)) {
        const parsedValue = parseInt(value, 10);
        input.value = parsedValue;
        return parsedValue;
    }
    return null;
}

function pasteCheckboxInput(input, value) {
    const isChecked = value === "true";
    input.checked = isChecked;
    return isChecked;
}

function updateSelectInput(select, value) {
    const isIncluded = [...select.options].some(
        (option) => option.textContent === value
    );
    if (isIncluded) {
        select.value = value;
        return value;
    }
    return null;
}

function updateDatalistInput(input, value) {
    const listElement = document.getElementById(input.getAttribute("list"));
    const isIncluded =
        listElement &&
        [...listElement.options].some((option) => option.value === value);
    if (isIncluded) {
        input.value = value;
        return value;
    }
    return null;
}

function getRowId(index) {
    const tr = document.querySelectorAll("tbody tr")[index];
    return tr?.querySelector("td[data-id]")?.dataset.id || null;
}

function getTitle(col) {
    const th = document.querySelector("data-grid thead").querySelectorAll("th")[
        col + 1
    ];
    return th ? th.textContent : null;
}

export default {
    copyCells,
    pasteCells,
};
