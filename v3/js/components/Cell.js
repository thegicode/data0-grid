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
            this._input.ariaReadOnly = Boolean(value);
        } else {
            this._input.readOnly = Boolean(value);
        }
    }

    createCell() {
        const cell = document.createElement("td");
        cell.dataset.row = this._row;
        cell.dataset.col = this._col;
        // cell.tabIndex = 0;

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
        // this._input.addEventListener("keydown", () => {
        //     console.log("keydown");
        // });
    }

    onClick(e) {
        this.dataGrid.csvButtonVisible = false;

        const cells = this.selection.selectedCells;
        if (e.shiftKey && cells.size > 0) {
            this.selection.selectRange(Array.from(cells)[0], this._cell);
        } else {
            this.selection.selectCell(this._cell, e.shiftKey);
        }
    }

    onDBClick() {
        // if (input.ariaReadOnly === "true") {
        //     input.ariaReadOnly = "false";
        // } else {
        this._input.readOnly = false;
        // }
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

        // const firstSelectedCell = Array.from(cells)[0];

        const isEditing = this.readOnly === false;

        // console.log("isEditing", isEditing);
        // console.log("isComposing", this.dataGrid.isComposing);

        // if (this._input && e.key === " ") {
        //     if (this._type === "checkbox") {
        //         e.preventDefault();
        //         this._input.focus();
        //         this._input.checked = !this._input.checked;
        //         return;
        //     } else if (this._type === "select") {
        //         this._input.focus();
        //         // input.ariaReadOnly = "false";
        //         return;
        //     }
        // }

        if (isEditing && !this.dataGrid.isComposing) {
            switch (e.key) {
                case "Enter":
                    // 아래로 이동하고 포커스
                    // shift key 인 경우 위로 이동
                    e.preventDefault();
                    if (e.shiftKey) {
                        this.selection.moveTo(this._row - 1, this._col, true);
                    } else {
                        this.selection.moveTo(this._row + 1, this._col, true);
                    }
                    break;
                case "Tab":
                    e.preventDefault();
                    this._input.blur();
                    this.readOnly = true;
                    if (e.shiftKey) {
                        this.selection.moveTo(this._row, this._col - 1);
                    } else {
                        this.selection.moveTo(this._row, this._col + 1);
                    }
                    break;
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
                    if (e.shiftKey) {
                        this.selection.moveTo(this._row, this._col - 1);
                    } else {
                        this.selection.moveTo(this._row, this._col + 1);
                    }
                    break;
            }
        }
    }
}
