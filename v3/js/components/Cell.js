export default class Cell {
    constructor(createGrid, i, j) {
        this.dataGrid = createGrid.dataGrid;
        this.selection = createGrid.selection;
        this.createGrid = createGrid;

        const currentField = createGrid.FIELD_DEFINITIONS[j];
        this._row = i;
        this._col = j;
        this._type = currentField.type;
        this._title = currentField.title;
        this._value = createGrid.manager.data[i][this._title];
        this._originValue = this._value;

        return this.createCell();
    }

    get readOnly() {
        return this._input.hasAttribute("aria-readonly")
            ? this._input.ariaReadOnly === "true"
            : this._input.readOnly;
    }

    set readOnly(value) {
        if (this._input.hasAttribute("aria-readonly")) {
            this._input.ariaReadOnly = value;
        } else {
            this._input.readOnly = Boolean(value);
        }
    }

    createCell() {
        const cell = document.createElement("td");
        cell.dataset.row = this._row;
        cell.dataset.col = this._col;

        const input = this.createInput();
        cell.appendChild(input);

        this._input = input;
        this._cell = cell;
        this.addEvents();

        return cell;
    }

    createInput() {
        let input = document.createElement("input");
        switch (this._type) {
            case "datalist":
                input.type = "text";
                input.setAttribute(
                    "list",
                    this.createGrid.datalistId(this._title)
                );
                input.value = this._value;
                input.readOnly = true;
                break;
            case "select":
                const select = this.createGrid.selectObject[this._title];
                input = select.cloneNode(true);
                input.value = this._value;
                input.ariaReadOnly = true;
                break;
            case "checkbox":
                input.type = "checkbox";
                input.checked = Boolean(this._value);
                input.ariaReadOnly = true;
                break;
            default: // text, number
                input.type = this._type;
                input.value = this._value;
                input.readOnly = true;
                break;
        }
        return input;
    }

    addEvents() {
        this._cell.addEventListener("click", this.onClick.bind(this));
        this._cell.addEventListener("dblclick", this.onDBClick.bind(this));
        this._cell.addEventListener("input", this.onInput.bind(this));
        this._cell.addEventListener("focusin", this.onFocusIn.bind(this));
        this._input.addEventListener("keydown", this.onKeyDown.bind(this));

        if (this._type === "select") {
            this._input.addEventListener(
                "change",
                this.onSelectChange.bind(this)
            );
        }

        // select range
        this._cell.addEventListener("mousedown", this.onMouseDown.bind(this));
        this._cell.addEventListener("mousemove", this.onMouseMove.bind(this));
        this._cell.addEventListener("mouseup", this.onMouseUp.bind(this));
    }

    onClick(e) {
        this.dataGrid.csvButtonVisible = false;

        const cells = this.selection.selectedCells;
        if (e.shiftKey && cells.size > 0) {
            this.selection.selectRange(Array.from(cells)[0], this._cell);
        } else {
            this.selection.selectCell(this._cell, e.shiftKey);
            this._input.focus(); // checkbox 포커스 되어야 셀 이동이 된다.
        }
    }

    onDBClick() {
        this._input.readOnly = false;
        this._input.focus();
    }

    onInput() {
        if (this.dataGrid.isComposing) return;

        this._value = this._input.value;
        this._input.readOnly = false;

        console.log(
            `셀 (${this._row}, ${this._col}) 값 변경: ${this._input.value}`
        );
    }

    onFocusIn() {
        this._originValue = this._value;
    }

    onKeyDown(e) {
        const cells = this.selection.selectedCells;
        if (!cells.size) return;

        const isEditing = this.readOnly === false;
        const arrowKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];

        if (isEditing && !this.dataGrid.isComposing) {
            switch (e.key) {
                case "Enter":
                    e.preventDefault();
                    this.moveUpDown(e.shiftKey);
                    break;
                case "Tab":
                    e.preventDefault();
                    this._input.blur();
                    this.readOnly = true;
                    this.moveSide(e.shiftKey);
                    break;
                case "Escape":
                    e.preventDefault();
                    this._input.value = this._originValue;
                    this.readOnly = true;
                    break;
            }

            if (this._type === "checkbox" && arrowKeys.includes(e.key)) {
                this.handleArrowKey(e);
            }
        } else {
            switch (e.key) {
                case "Enter":
                    e.preventDefault();
                    this.readOnly = false;
                    this._input.focus();
                    break;
                case "Tab":
                    e.preventDefault();
                    this.moveSide(e.shiftKey);
                    break;
            }

            if (arrowKeys.includes(e.key)) {
                this.handleArrowKey(e);
            }
        }
    }

    moveUpDown(shiftKey) {
        if (shiftKey) {
            this.selection.moveTo(this._row - 1, this._col, true);
        } else {
            this.selection.moveTo(this._row + 1, this._col, true);
        }
    }

    moveSide(shiftKey) {
        if (shiftKey) {
            this.selection.moveTo(this._row, this._col - 1);
        } else {
            this.selection.moveTo(this._row, this._col + 1);
        }
    }

    handleArrowKey(e) {
        e.preventDefault();
        switch (e.key) {
            case "ArrowUp":
                this.selection.moveTo(this._row - 1, this._col);
                break;
            case "ArrowDown":
                this.selection.moveTo(this._row + 1, this._col);
                break;
            case "ArrowLeft":
                this.selection.moveTo(this._row, this._col - 1);
                break;
            case "ArrowRight":
                this.selection.moveTo(this._row, this._col + 1);
                break;
        }
    }

    onSelectChange() {
        this.readOnly = true;
        this.selection.moveTo(this._row + 1, this._col, true);
    }

    onMouseDown(e) {
        if (e.shiftKey) return;
        this.selection.isRangeSelecting = true;
        this.selection.rangeSelectingStart = this._cell;
        this.selection.clearSelection();
        this.selection.selectCell(this._cell);
    }

    onMouseMove(e) {
        if (this.selection.isRangeSelecting) {
            this.selection.selectRange(
                this.selection.rangeSelectingStart,
                this._cell
            );
        }
    }

    onMouseUp() {
        this.selection.isRangeSelecting = false;
    }
}
