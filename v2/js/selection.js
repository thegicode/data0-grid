export let selectedCells = new Set();
export let currentSelectionRange = [];

export function selectCell(cell, add = false) {
    if (!add) {
        selectedCells.forEach((selectedCell) => {
            selectedCell.classList.remove("selected");
            const input =
                selectedCell.querySelector("input") ||
                selectedCell.querySelector("select");
        });
        selectedCells.clear();
    }

    selectedCells.add(cell);
    cell.classList.add("selected");
}

export function selectRange(dragStartCell, endCell) {
    const startRow = parseInt(dragStartCell.dataset.row);
    const startCol = parseInt(dragStartCell.dataset.col);
    const endRow = parseInt(endCell.dataset.row);
    const endCol = parseInt(endCell.dataset.col);

    const minRow = Math.min(startRow, endRow);
    const maxRow = Math.max(startRow, endRow);
    const minCol = Math.min(startCol, endCol);
    const maxCol = Math.max(startCol, endCol);

    // Clear previous selection
    selectedCells.forEach((cell) => {
        cell.classList.remove("selected");
    });
    selectedCells.clear();

    let result = [];
    for (let row = minRow; row <= maxRow; row++) {
        let rows = [];
        for (let col = minCol; col <= maxCol; col++) {
            const cell = tbody.querySelector(
                `td[data-row="${row}"][data-col="${col}"]`
            );
            if (cell) selectCell(cell, true);
            rows.push(cell);
        }
        result.push(rows);
    }
    currentSelectionRange = result;

    if (selectedCells.size > 1) csvButton.hidden = false;
}
