let clipboardData = [];

function copyCells(selectedCells, currentSelectionRange) {
    let clipboardText;
    if (selectedCells.size === 1) {
        const cell = [...selectedCells][0];
        clipboardText = getInputValue(cell);
    } else {
        clipboardData = currentSelectionRange.map((row) =>
            row.map((cell) => getInputValue(cell))
        );
        clipboardText = clipboardData.map((row) => row.join("\t")).join("\n");
    }

    navigator.clipboard.writeText(clipboardText).then(() => {
        console.log("Data copied to clipboard");
    });
}

function pasteCells(selectedCells, tbody) {
    navigator.clipboard
        .readText()
        .then((text) => {
            const firstSelectedCell = Array.from(selectedCells)[0];
            let targetRow = parseInt(firstSelectedCell.dataset.row);
            let targetCol = parseInt(firstSelectedCell.dataset.col);

            const data = text.split("\n").map((row) => row.split("\t"));

            data.forEach((row, rowIndex) => {
                row.forEach((value, colIndex) => {
                    const targetCellSelector = `td[data-row="${
                        targetRow + rowIndex
                    }"][data-col="${targetCol + colIndex}"]`;
                    let targetCell = tbody.querySelector(targetCellSelector);
                    if (!targetCell) return;

                    const input =
                        targetCell.querySelector("input") ||
                        targetCell.querySelector("select");
                    if (!input) return;

                    switch (input.type) {
                        case "number":
                            if (parseInt(value)) input.value = parseInt(value);
                            break;
                        case "checkbox":
                            if (value === "true" || value === "false")
                                input.checked = Boolean(value === "true");
                            break;
                        default:
                            input.value = value;
                    }

                    selectedCells.add(targetCell);
                    targetCell.classList.add("selected");
                });
            });
        })
        .catch((err) => {
            console.error("Failed to read clipboard contents: ", err);
        });
}

const getInputValue = (cell) => {
    const inputElement =
        cell.querySelector("input") || cell.querySelector("select");

    return inputElement.type === "checkbox"
        ? inputElement.checked
        : inputElement.value;
};

export default {
    copyCells,
    pasteCells,
};
