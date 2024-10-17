import Selection from "./Selection";
import DataModel from "./models/DataModel";
import CheckboxCell from "./dataCells/CheckboxCell";
import SelectCell from "./dataCells/SelectCell";
import DatalistCell from "./dataCells/DatalistCell";
import StringCell from "./dataCells/StringCell";
import TextNumberCell from "./dataCells/TextNumberCell";
import Table from "./Table";
import DataGrid from "./DataGrid";

export default class Cell {
    public dataGrid: DataGrid;
    public dataModel: DataModel;
    public selection: Selection;
    public tableController: Table;

    private _cell: IHTMLTableCellElementWithInstance | null;
    private _rowElement: HTMLTableRowElement | null;
    private _row: number;
    private _col: number;
    private _type: string;
    private _key: string;
    private _value: TDataValue;
    private _contentElement: TDataCell | null;

    constructor(
        tableController: Table,
        params: ICellParams,
        row: HTMLTableRowElement
    ) {
        this.dataGrid = tableController.dataGrid;
        this.dataModel = this.dataGrid.dataModel;
        this.selection = tableController.selection;
        this.tableController = tableController;

        this._cell = null;
        this._rowElement = row;
        this._row = params.row;
        this._col = params.col;
        this._type = params.type;
        this._key = params.key;
        this._value = params.value;
        this._contentElement = null;

        this.createCell(params.value); // return 제거
    }

    get row() {
        return this._row;
    }

    set row(value: number) {
        if (this._cell) {
            this._cell.dataset.row = value.toString();
        }
        this._row = value;
    }

    get col() {
        return this._col;
    }

    set col(value: number) {
        if (this._cell) {
            this._cell.dataset.col = value.toString();
        }
        this._col = value;
    }

    get cellElement() {
        return this._cell;
    }

    get contentElement() {
        return this._contentElement;
    }

    get readOnly() {
        return this._contentElement ? this._contentElement.readOnly : true;
    }

    set readOnly(value: boolean) {
        if (this._contentElement) {
            this._contentElement.readOnly = value;
        }
    }

    get key() {
        return this._key;
    }

    get value() {
        return this._value;
    }

    set value(arg: TDataValue) {
        this._value = arg;
        if (this._contentElement) {
            this._contentElement.value = arg;
        }
    }

    get type() {
        return this._type;
    }

    focus() {
        if (this._contentElement) {
            this._contentElement.focus();
        }
    }

    createCell(value: TDataValue) {
        const cell = document.createElement(
            "td"
        ) as IHTMLTableCellElementWithInstance;
        cell.dataset.row = this._row.toString();
        cell.dataset.col = this._col.toString();

        const childElement = this.createChildElement(value);
        cell.appendChild(childElement);

        this._contentElement = childElement;
        this._cell = cell;

        this.bindEvents();

        // Store the Cell instance reference in the DOM element
        (cell as IHTMLTableCellElementWithInstance).instance = this;

        this.setRowId(value);
    }

    setRowId(value: TDataValue) {
        if (this._key === "id" && this._rowElement) {
            this._rowElement.dataset.id = value.toString();
        }
    }

    createChildElement(value: TDataValue) {
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
            case "datalist-fix":
                const isFix = true;
                return new DatalistCell(params, isFix);
            default: // "string":
                return new StringCell(params);
        }
    }

    bindEvents() {
        if (this._cell) {
            this._cell.addEventListener("click", this.onClick.bind(this));
            this._cell.addEventListener("dblclick", this.onDBClick.bind(this));

            // select range
            this._cell.addEventListener(
                "mousedown",
                this.onMouseDown.bind(this)
            );
            this._cell.addEventListener(
                "mousemove",
                this.onMouseMove.bind(this)
            );
            this._cell.addEventListener("mouseup", this.onMouseUp.bind(this));
        }
    }

    onClick(e: MouseEvent) {
        this.dataGrid.csvButtonVisible = false;

        const cells = this.selection.selectedCells;
        cells.forEach((cell) => {
            (cell as IHTMLTableCellElementWithInstance).instance.readOnly =
                true;
        });

        if (!this._cell) return;

        if (e.shiftKey && cells.size > 0) {
            this.selection.selectRange(Array.from(cells)[0], this._cell);
        } else {
            this.selection.selectCell(this._cell, e.shiftKey);
        }
    }

    onDBClick() {
        this.readOnly = false;
        if (this._contentElement) {
            this._contentElement.focus();
        }
    }

    onMouseDown(e: MouseEvent) {
        if (e.shiftKey || !this._cell) return;
        this.selection.isRangeSelecting = true;
        this.selection.rangeSelectingStart = this._cell;
        this.selection.clearSelection();
        this.selection.selectCell(this._cell);
    }

    onMouseMove(e: MouseEvent) {
        if (
            this.selection.isRangeSelecting &&
            this.selection.rangeSelectingStart &&
            this._cell
        ) {
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
