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
            this.saveCellData();
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

    saveCellData() {
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
