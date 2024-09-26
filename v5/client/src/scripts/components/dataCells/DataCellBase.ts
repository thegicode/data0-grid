import Cell from "../Cell";
import Selection from "../Selection";
import DataModel from "../models/DataModel";

export default abstract class DataCellBase extends HTMLElement {
    public cellController: Cell;
    public dataModel: DataModel;
    public selection: Selection;

    protected _type: string;
    protected _key: string;
    protected _value: TDataValue;
    protected _readOnly: boolean;
    protected _el:
        | HTMLInputElement
        | HTMLSelectElement
        | HTMLDataListElement
        | HTMLElement
        | null; // _el은 구체적인 타입을 정의

    protected abstract createElement():
        | HTMLElement
        | HTMLInputElement
        | HTMLSelectElement
        | HTMLDataListElement
        | null;

    constructor(params: IDataCellParams) {
        super();

        this.cellController = params.cellController;
        this.dataModel = params.dataModel;
        this.selection = params.selection;

        this._type = params.type;
        this._key = params.key;
        this._value = params.value;

        this._readOnly = true;
        this._el = null;
    }

    get readOnly() {
        return this._readOnly;
    }

    set readOnly(value: boolean) {
        this._readOnly = value;
        if (this._el instanceof HTMLInputElement) {
            this._el.readOnly = value; // input 또는 select 요소의 readOnly 속성 설정
        }
    }

    get key() {
        return this._key;
    }

    get type() {
        return this._type;
    }

    get value() {
        return this._value;
    }

    set value(arg: TDataValue) {
        this._value = arg;

        if (
            this._el instanceof HTMLInputElement ||
            this._el instanceof HTMLSelectElement
        ) {
            this._el.value = arg.toString();
        }
    }

    get currentInputValue() {
        if (
            this._el instanceof HTMLInputElement ||
            this._el instanceof HTMLSelectElement
        ) {
            if (this._type === "number") {
                return Number(this._el.value);
            } else if (this._type === "checkbox") {
                return (this._el as HTMLInputElement).checked;
            } else {
                return this._el.value;
            }
        }
    }

    focus() {
        this._el?.focus();
    }

    blur() {
        this._el?.blur();
    }

    connectedCallback() {
        this.render();
        this.addEventListener("change", this.onChange.bind(this));
        this.addEventListener("keydown", this.onKeyDown.bind(this));
    }

    render() {
        this._el = this.createElement();
        if (this._el) {
            this.appendChild(this._el);
        }
    }

    onChange(e: Event) {
        const newValue = this.currentInputValue;
        if (newValue === null || newValue === undefined) return;

        if (this._value !== newValue) {
            this.value = newValue;
            this.updateData();
        }
    }

    onKeyDown(e: KeyboardEvent) {
        const cells = this.selection.selectedCells;
        if (!cells.size) return;

        const isEditing = this.readOnly === false;
        const arrowKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];

        if (isEditing) {
            switch (e.key) {
                case "Enter":
                    e.preventDefault();
                    this.readOnly = true;
                    const nextCell = this.moveUpDown(e.shiftKey);
                    if (!nextCell) return;
                    nextCell.instance.readOnly =
                        this._type === "checkbox" ? false : true;
                    break;
                case "Tab":
                    e.preventDefault();
                    this.blur();
                    this.readOnly = true;
                    this.moveSide(e.shiftKey);
                    break;
                case "Escape":
                    e.preventDefault();
                    this.value = this._value;
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
                        this.focus();
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

    moveUpDown(shiftKey: boolean) {
        if (shiftKey) {
            return this.selection.moveTo(
                this.cellController.row - 1,
                this.cellController.col
            );
        } else {
            return this.selection.moveTo(
                this.cellController.row + 1,
                this.cellController.col
            );
        }
    }

    moveSide(shiftKey: boolean) {
        if (shiftKey) {
            this.selection.moveTo(
                this.cellController.row,
                this.cellController.col - 1
            );
        } else {
            this.selection.moveTo(
                this.cellController.row,
                this.cellController.col + 1
            );
        }
    }

    handleArrowKey(e: KeyboardEvent) {
        e.preventDefault();
        switch (e.key) {
            case "ArrowUp":
                this.selection.moveTo(
                    this.cellController.row - 1,
                    this.cellController.col
                );
                break;
            case "ArrowDown":
                this.selection.moveTo(
                    this.cellController.row + 1,
                    this.cellController.col
                );
                break;
            case "ArrowLeft":
                this.selection.moveTo(
                    this.cellController.row,
                    this.cellController.col - 1
                );
                break;
            case "ArrowRight":
                this.selection.moveTo(
                    this.cellController.row,
                    this.cellController.col + 1
                );
                break;
        }
    }

    updateData() {
        const id = this.getId();
        if (id) {
            this.dataModel.updateFieldValue(id, this._key, this.value);
        }
    }

    getId(): string | null {
        const row = this.closest("tr");
        if (!row) return null;
        return row.dataset.id || null;
    }
}
