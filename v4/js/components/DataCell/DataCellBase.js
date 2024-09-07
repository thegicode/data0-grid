export default class DataCellBase extends HTMLElement {
    constructor(params) {
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

    set readOnly(value) {
        this._readOnly = value;
        this._el.readOnly = value;
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

    set value(arg) {
        const newValue = this.checkValueType(arg);

        // newValue가 null 또는 undefined인 경우 반환
        if (newValue === null || newValue === undefined) return;

        // 유효한 값이 있을 때만 값을 설정
        this._value = newValue;
        this._el.value = newValue;
    }

    get currentValue() {
        return this._el.value;
    }

    focus() {
        this._el.focus();
    }

    blur() {
        this._el.blur();
    }

    connectedCallback() {
        this.render();

        this.addEventListener("change", this.onChange.bind(this));
        this.addEventListener("keydown", this.onKeyDown.bind(this));
    }

    render() {
        this._el = this.createElement();
        this.appendChild(this._el);
    }

    createElement() {
        //
    }

    checkValueType() {
        //
    }

    onChange(e) {
        const currentValue = this._el.value;

        if (this._value !== currentValue) {
            this._value = currentValue;
            this.updateData();
        }

        if (this._type === "select") {
            this.onSelectChange();
            this.readOnly = true;
            const nextCell = this.selection.moveTo(
                this.cellController.row + 1,
                this.cellController.col
            );
            if (nextCell) nextCell.readOnly = false;
        }
    }

    onKeyDown(e) {
        const cells = this.selection.selectedCells;
        if (!cells.size) return;

        const isEditing = this.readOnly === false;
        const arrowKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];

        // TODO
        // if (isEditing && !this.cellController.dataGrid.isComposing) {
        if (isEditing) {
            switch (e.key) {
                case "Enter":
                    e.preventDefault();
                    this.readOnly = true;
                    const nextCell = this.moveUpDown(e.shiftKey);
                    if (!nextCell) return;
                    nextCell.readOnly =
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
                    this.value = this._value; // Restore the original value
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

    moveUpDown(shiftKey) {
        if (shiftKey) {
            return this.selection.moveTo(
                this.cellController._row - 1,
                this.cellController._col
            );
        } else {
            return this.selection.moveTo(
                this.cellController._row + 1,
                this.cellController._col
            );
        }
    }

    moveSide(shiftKey) {
        if (shiftKey) {
            this.selection.moveTo(
                this.cellController._row,
                this.cellController._col - 1
            );
        } else {
            this.selection.moveTo(
                this.cellController._row,
                this.cellController._col + 1
            );
        }
    }

    handleArrowKey(e) {
        e.preventDefault();
        switch (e.key) {
            case "ArrowUp":
                this.selection.moveTo(
                    this.cellController._row - 1,
                    this.cellController._col
                );
                break;
            case "ArrowDown":
                this.selection.moveTo(
                    this.cellController._row + 1,
                    this.cellController._col
                );
                break;
            case "ArrowLeft":
                this.selection.moveTo(
                    this.cellController._row,
                    this.cellController._col - 1
                );
                break;
            case "ArrowRight":
                this.selection.moveTo(
                    this.cellController._row,
                    this.cellController._col + 1
                );
                break;
        }
    }

    updateData() {
        const id = this.getCellId();
        this.dataModel.updateFieldValue(id, this._key, this.value);
    }

    // TODO
    getCellId() {
        const idCell =
            this.parentElement.parentElement.querySelector("td[data-id]");
        return idCell ? idCell.dataset.id : null;
    }
}
