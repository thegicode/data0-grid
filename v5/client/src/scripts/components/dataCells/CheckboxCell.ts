import DataCellBase from "./DataCellBase.js";

export default class CheckboxCell extends DataCellBase {
    protected _el: HTMLInputElement | null = null;

    constructor(params: IDataCellParams) {
        super(params);
    }

    get readOnly() {
        return this._readOnly;
    }

    set readOnly(value) {
        this._readOnly = Boolean(value);
        if (this._el) this._el.ariaReadOnly = String(Boolean(value));
    }

    createElement() {
        const input = document.createElement("input");
        input.type = "checkbox";
        input.checked = this.isTrue();
        input.ariaReadOnly = this._readOnly.toString();
        return input;
    }

    isTrue() {
        return (
            this._value === true ||
            Boolean(this._value === "true") ||
            Boolean(this._value === "on")
        );
    }
}
