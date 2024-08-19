export default class Selectioon {
    constructor(dataGrid) {
        this.dataGrid = dataGrid;

        this._selectedCells = new Set();
        this._currentSelectionRange = [];
    }

    get selectedCells() {
        return this._selectedCells;
    }

    set selectedCells(arg) {
        this._selectedCells = arg;
    }

    selectCell(cell, add = false) {
        if (!add) {
            this._selectedCells.forEach((selectedCell) => {
                selectedCell.classList.remove("selected");
                // const input =
                //     selectedCell.querySelector("input") ||
                //     selectedCell.querySelector("select");
            });
            this._selectedCells.clear();
        }

        this._selectedCells.add(cell);
        cell.classList.add("selected");
    }

    selectRange(dragStartCell, endCell) {
        const startRow = parseInt(dragStartCell.dataset.row);
        const startCol = parseInt(dragStartCell.dataset.col);
        const endRow = parseInt(endCell.dataset.row);
        const endCol = parseInt(endCell.dataset.col);

        const minRow = Math.min(startRow, endRow);
        const maxRow = Math.max(startRow, endRow);
        const minCol = Math.min(startCol, endCol);
        const maxCol = Math.max(startCol, endCol);

        // Clear previous selection
        this._selectedCells.forEach((cell) => {
            cell.classList.remove("selected");
        });
        this._selectedCells.clear();

        let result = [];
        for (let row = minRow; row <= maxRow; row++) {
            let rows = [];
            for (let col = minCol; col <= maxCol; col++) {
                const cell = this.dataGrid.tbody.querySelector(
                    `td[data-row="${row}"][data-col="${col}"]`
                );
                if (cell) this.selectCell(cell, true);
                rows.push(cell);
            }
            result.push(rows);
        }
        this._currentSelectionRange = result;

        if (this._selectedCells.size > 1) this.dataGrid.csvButtonVisible = true;
    }
}
