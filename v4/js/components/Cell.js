import DataInputTextNumber from "./DataGridComponents/DataInputTextNumber.js";
import DataText from "./DataGridComponents/DataText.js";
import DataSelect from "./DataGridComponents/DataSelect.js";
import DataCheckbox from "./DataGridComponents/DataCheckbox.js";
import DataDataList from "./DataGridComponents/DataDataList.js";

export default class Cell {
    constructor(tableController, params) {
        this.dataGrid = tableController.dataGrid;
        this.dataModel = this.dataGrid.dataModel;
        this.selection = tableController.selection;
        this.tableController = tableController;

        this._cell = null;
        this._row = params.row;
        this._col = params.col;
        this._type = params.type;
        this._title = params.title;

        return this.createCell(params.value);
    }

    get row() {
        return this._row;
    }

    set row(value) {
        this._cell.dataset.row = value;
        this._row = value;
    }

    get col() {
        return this._col;
    }

    set col(value) {
        this._cell.dataset.col = value;
        this._col = value;
    }

    get value() {
        return this._dataCell.value;
    }

    set value(arg) {
        this._dataCell.value = arg;
    }

    get readOnly() {
        return this._dataCell.readOnly;
    }

    set readOnly(value) {
        this._dataCell.readOnly = value;
    }

    get dataCell() {
        return this._dataCell;
    }

    createCell(value) {
        const cell = document.createElement("td");
        cell.dataset.row = this._row;
        cell.dataset.col = this._col;

        if (this._title === "id") {
            // cell.dataset.id = this._value;
            cell.dataset.id = value;
        }

        const childElement = this.createChildElement(value);

        cell.appendChild(childElement);

        this._dataCell = childElement;
        this._cell = cell;

        this.bindEvents();

        // Store the Cell instance reference in the DOM element
        cell.instance = this;

        return cell;
    }

    createChildElement(value) {
        const params = {
            dataModel: this.dataModel,
            type: this._type,
            title: this._title,
            value: value,
        };

        switch (this._type) {
            case "text":
            case "number":
                return new DataInputTextNumber(params);
            case "checkbox":
                return new DataCheckbox(params);
            case "select":
                return new DataSelect(params);
            case "datalist":
                return new DataDataList(params);
            default: // "string":
                return new DataText(params);
        }
    }

    bindEvents() {
        this._cell.addEventListener("click", this.onClick.bind(this));
        this._cell.addEventListener("dblclick", this.onDBClick.bind(this));
        // this._cell.addEventListener("input", this.onInput.bind(this));
        this._dataCell.addEventListener("change", this.onChange.bind(this));

        this._dataCell.addEventListener("keydown", this.onKeyDown.bind(this));

        // select range
        this._cell.addEventListener("mousedown", this.onMouseDown.bind(this));
        this._cell.addEventListener("mousemove", this.onMouseMove.bind(this));
        this._cell.addEventListener("mouseup", this.onMouseUp.bind(this));
    }

    onClick(e) {
        this.dataGrid.csvButtonVisible = false;

        const cells = this.selection.selectedCells;

        cells.forEach((cell) => {
            cell.instance.dataCell.readOnly = true;
        });

        if (e.shiftKey && cells.size > 0) {
            this.selection.selectRange(Array.from(cells)[0], this._cell);
        } else {
            this.selection.selectCell(this._cell, e.shiftKey);
        }
    }

    onDBClick() {
        this.readOnly = false;
        this._dataCell.focus();
    }

    onInput(e) {
        if (this.dataGrid.isComposing) return;
        // console.log(
        //     `셀 (${this._row}, ${this._col}) 값 변경: ${this._dataCell.value}`
        // );
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
                    this.readOnly = true;
                    const nextDataCell = this.moveUpDown(e.shiftKey);
                    nextDataCell.readOnly = true;
                    break;
                case "Tab":
                    e.preventDefault();
                    this._dataCell.blur();
                    this.readOnly = true;
                    this.moveSide(e.shiftKey);
                    break;
                case "Escape":
                    e.preventDefault();
                    this.value = this._dataCell._value; // Restore the original value
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
                    if (this._type === "string") {
                        this.moveUpDown(e.shiftKey);
                    } else {
                        this.readOnly = false;
                        this._dataCell.focus();
                    }
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
            return this.selection.moveTo(this._row - 1, this._col);
        } else {
            return this.selection.moveTo(this._row + 1, this._col);
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

    onChange(e) {
        const currentValue = this._dataCell.currentValue;

        if (this.value !== currentValue) {
            this.value = currentValue;
            this.saveCellData();
        }

        if (this._type === "select") {
            this.readOnly = true;
            const nextDataCell = this.selection.moveTo(
                this._row + 1,
                this._col
            );

            nextDataCell.readOnly = false;
        }
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

    saveCellData() {
        const id = this.getCellId();
        // const title = this.getTitle();
        // console.log(title, this._title);
        this.dataModel.updateFieldValue(id, this._title, this.value);
    }

    getCellId() {
        const cellWithId =
            this._cell.parentElement.querySelector("td[data-id]");
        return cellWithId ? cellWithId.dataset.id : null;
    }

    getTitle() {
        const th = this.dataGrid.thead.querySelectorAll("th")[this._col + 1];
        return th ? th.textContent : null;
    }
}
