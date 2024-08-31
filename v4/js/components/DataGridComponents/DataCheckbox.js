import DataCellBase from "./DataCellBase.js";

export default class DataCheckbox extends DataCellBase {
    constructor(params) {
        super(params);
    }

    set readOnly(value) {
        this._readOnly = Boolean(value);
        this._el.ariaReadOnly = Boolean(value);
    }

    set value(arg) {
        this._value = Boolean(arg);
        this._el.checked = Boolean(arg);
    }

    get currentValue() {
        return this._el.checked;
    }

    createElement() {
        const input = document.createElement("input");
        input.type = "checkbox";
        input.checked = this._value;
        input.ariaReadOnly = this._readOnly;
        return input;
    }
}
