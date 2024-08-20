export default class Selectioon {
    constructor(dataGrid) {
        this.dataGrid = dataGrid;

        this._selectedCells = new Set();
        this._currentSelectionRange = [];
        this._isRangeSelecting = false;
        this._rangeSelectingStart = null;
    }

    get selectedCells() {
        return this._selectedCells;
    }

    set selectedCells(value) {
        this._selectedCells = value;
    }

    get currentSelectionRange() {
        return this._currentSelectionRange;
    }

    get isRangeSelecting() {
        return this._isRangeSelecting;
    }

    set isRangeSelecting(value) {
        this._isRangeSelecting = value;
    }

    get rangeSelectingStart() {
        return this._rangeSelectingStart;
    }

    set rangeSelectingStart(value) {
        this._rangeSelectingStart = value;
    }

    selectCell(cell, isShiftKey = false) {
        if (!isShiftKey) {
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

    moveTo(row, col, editable) {
        const nextCell = this.dataGrid.tbody.querySelector(
            `td[data-row="${row}"][data-col="${col}"]`
        );

        if (nextCell) {
            this.selectCell(nextCell);
            nextCell.scrollIntoView({
                behavior: "smooth",
                block: "center", // 수직 정렬을 지정
                inline: "end", // 수평 정렬을 지정
            });

            const nextInput =
                nextCell.querySelector("input") ||
                nextCell.querySelector("select");

            nextInput.focus();

            if (editable) {
                if (nextInput.hasAttribute("aria-readonly")) {
                    nextInput.ariaReadOnly = "false";
                } else {
                    nextInput.readOnly = false;
                }
            }

            // if (isFocus) {
            // }
        }
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

    clearSelection() {
        // const selctedTh =
        //     this.dataGrid.querySelector.querySelector(".selected-th");
        // if (selctedTh) {
        //     selctedTh.classList.remove("selected-th");
        // }

        this._selectedCells.forEach((cell) => {
            cell.classList.remove("selected");
        });

        this._selectedCells.clear();
    }
}
