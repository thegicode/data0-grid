import DataGrid from "./DataGrid";

export default class Selection {
    public dataGrid: DataGrid;

    private _selectedCells: Set<IHTMLTableCellElementWithInstance>;
    private _currentSelectionRange: IHTMLTableCellElementWithInstance[][];
    private _isRangeSelecting: boolean;
    private _rangeSelectingStart: IHTMLTableCellElementWithInstance | null;
    private _copiedCells: IHTMLTableCellElementWithInstance[];

    constructor(dataGrid: DataGrid) {
        this.dataGrid = dataGrid;

        this._selectedCells = new Set();
        this._currentSelectionRange = [];
        this._isRangeSelecting = false;
        this._rangeSelectingStart = null;

        this._copiedCells = [];
    }

    get selectedCells(): Set<IHTMLTableCellElementWithInstance> {
        return this._selectedCells;
    }

    set selectedCells(value: Set<IHTMLTableCellElementWithInstance>) {
        this._selectedCells = value;
    }

    get currentSelectionRange(): IHTMLTableCellElementWithInstance[][] {
        return this._currentSelectionRange;
    }

    get isRangeSelecting(): boolean {
        return this._isRangeSelecting;
    }

    set isRangeSelecting(value: boolean) {
        this._isRangeSelecting = value;
    }

    get rangeSelectingStart(): IHTMLTableCellElementWithInstance | null {
        return this._rangeSelectingStart;
    }

    set rangeSelectingStart(value: IHTMLTableCellElementWithInstance | null) {
        this._rangeSelectingStart = value;
    }

    set copiedCell(value: IHTMLTableCellElementWithInstance[]) {
        this._copiedCells = value;
    }

    get copiedCell(): IHTMLTableCellElementWithInstance[] {
        return this._copiedCells;
    }

    selectCell(cell: IHTMLTableCellElementWithInstance, append = false) {
        if (!append) {
            this.clearSelection();
        }

        this._selectedCells.add(cell);
        cell.classList.add("selected");
        cell.instance.focus(); // 안전하게 instance 속성에 접근

        if (cell.instance.type === "checkbox") {
            cell.instance.readOnly = false;
        }
    }

    moveTo(row: number, col: number) {
        const nextCell = this.dataGrid.tbody?.querySelector(
            `td[data-row="${row}"][data-col="${col}"]`
        ) as IHTMLTableCellElementWithInstance | null;

        if (nextCell) {
            this.selectCell(nextCell);

            nextCell.scrollIntoView({
                behavior: "smooth",
                block: "center", // 수직 정렬을 지정
                inline: "end", // 수평 정렬을 지정
            });

            if (nextCell.instance.type === "checkbox") {
                nextCell.instance.readOnly = false;
            }

            return nextCell;
        }
    }

    selectRange(
        startCell: IHTMLTableCellElementWithInstance,
        endCell: IHTMLTableCellElementWithInstance
    ) {
        const startRow = startCell.instance.row;
        const startCol = startCell.instance.col;
        const endRow = endCell.instance.row;
        const endCol = endCell.instance.col;

        const minRow = Math.min(startRow, endRow);
        const maxRow = Math.max(startRow, endRow);
        const minCol = Math.min(startCol, endCol);
        const maxCol = Math.max(startCol, endCol);

        this.clearSelection();

        let newSelection: IHTMLTableCellElementWithInstance[][] = [];
        for (let row = minRow; row <= maxRow; row++) {
            let rowSelection: IHTMLTableCellElementWithInstance[] = [];
            for (let col = minCol; col <= maxCol; col++) {
                const cell = this.dataGrid.tbody?.querySelector(
                    `td[data-row="${row}"][data-col="${col}"]`
                ) as IHTMLTableCellElementWithInstance | null;
                if (cell) {
                    this.selectCell(cell, true);
                    rowSelection.push(cell);
                }
            }
            newSelection.push(rowSelection);
        }

        this._currentSelectionRange = newSelection;

        if (this._selectedCells.size > 1) {
            this.dataGrid.csvButtonVisible = true;
        }
    }

    clearSelection() {
        this._selectedCells.forEach((cell) => {
            cell.classList.remove("selected");
        });

        this._selectedCells.clear();

        const selectedTh = this.dataGrid.querySelector(".selected-th");
        if (selectedTh) {
            selectedTh.classList.remove("selected-th");
        }
    }
}
