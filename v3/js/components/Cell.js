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

    createCell() {
        const cell = document.createElement("td");
        cell.dataset.row = this._row;
        cell.dataset.col = this._col;
        const input = this.createInput();
        cell.appendChild(input);

        this.input = input;
        this.cell = cell;
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
        this.cell.addEventListener("click", this.onClick.bind(this));
        this.cell.addEventListener("dblclick", this.onDBClick.bind(this));
        this.cell.addEventListener("input", this.onInput.bind(this));
        this.cell.addEventListener("focusin", this.onFocusIn.bind(this));
    }

    onClick(e) {
        this.dataGrid.csvButtonVisible = false;

        const cells = this.selection.selectedCells;
        if (e.shiftKey && cells.size > 0) {
            this.selection.selectRange(Array.from(cells)[0], this.cell);
        } else {
            this.selection.selectCell(this.cell, e.shiftKey);
        }
    }

    onDBClick() {
        // if (input.ariaReadOnly === "true") {
        //     input.ariaReadOnly = "false";
        // } else {
        this.input.readOnly = false;
        // }
        this.input.focus();
    }

    onInput() {
        this._value = this.input.value;
        this.input.readOnly = false;

        console.log(
            `셀 (${this._row}, ${this._col}) 값 변경: ${this.input.value}`
        );
    }

    onFocusIn() {
        this._originValue = this._value;
    }
}
