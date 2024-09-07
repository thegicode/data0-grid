import TextNumberCell from "./DataCells/TextNumberCell.js";
import StringCell from "./DataCells/StringCell.js";
import SelectCell from "./DataCells/SelectCell.js";
import CheckboxCell from "./DataCells/CheckboxCell.js";
import DatalistCell from "./DataCells/DatalistCell.js";

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
        this._key = params.key;
        this._contnetElement = null;

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

    get contentElement() {
        return this._contnetElement;
    }

    get readOnly() {
        return this._contnetElement.readOnly;
    }

    set readOnly(value) {
        this._contnetElement.readOnly = value;
    }

    //

    get key() {
        return this._key;
    }

    get value() {
        return this._contnetElement.value;
    }

    set value(arg) {
        this._contnetElement.value = arg;
    }

    get type() {
        return this._type;
    }

    focus() {
        this._contnetElement.focus();
    }

    createCell(value) {
        const cell = document.createElement("td");
        cell.dataset.row = this._row;
        cell.dataset.col = this._col;

        if (this._key === "id") {
            cell.dataset.id = value;
        }

        const childElement = this.createChildElement(value);
        cell.appendChild(childElement);

        this._contnetElement = childElement;
        this._cell = cell;

        this.bindEvents();

        // Store the Cell instance reference in the DOM element
        cell.instance = this;

        return cell;
    }

    createChildElement(value) {
        const params = {
            cellController: this,
            dataModel: this.dataModel,
            selection: this.selection,
            type: this._type,
            key: this._key,
            value: value,
        };

        switch (this._type) {
            case "text":
            case "number":
                return new TextNumberCell(params);
            case "checkbox":
                return new CheckboxCell(params);
            case "select":
                return new SelectCell(params);
            case "datalist":
                return new DatalistCell(params);
            default: // "string":
                return new StringCell(params);
        }
    }

    bindEvents() {
        this._cell.addEventListener("click", this.onClick.bind(this));
        this._cell.addEventListener("dblclick", this.onDBClick.bind(this));

        // TODO
        // this._cell.addEventListener("input", this.onInput.bind(this));

        // select range
        this._cell.addEventListener("mousedown", this.onMouseDown.bind(this));
        this._cell.addEventListener("mousemove", this.onMouseMove.bind(this));
        this._cell.addEventListener("mouseup", this.onMouseUp.bind(this));
    }

    onClick(e) {
        this.dataGrid.csvButtonVisible = false;

        const cells = this.selection.selectedCells;
        cells.forEach((cell) => {
            cell.instance.readOnly = true;
        });

        if (e.shiftKey && cells.size > 0) {
            this.selection.selectRange(Array.from(cells)[0], this._cell);
        } else {
            this.selection.selectCell(this._cell, e.shiftKey);
        }
    }

    onDBClick() {
        this.readOnly = false;
        this._contnetElement.focus();
    }

    // onInput(e) {
    // if (this.dataGrid.isComposing) return;
    // console.log(
    //     `셀 (${this._row}, ${this._col}) 값 변경: ${this._contnetElement.value}`
    // );
    // }

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
