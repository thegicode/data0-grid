import DataCellBase from "./DataCellBase.js";

export default class StringCell extends DataCellBase {
    constructor(params: IDataCellParams) {
        super(params);
    }

    // Don't remove
    get value() {
        return this._value;
    }

    // Don't remove
    set value(arg) {
        // can't set value
    }

    createElement() {
        const span = document.createElement("span");
        span.textContent = this._value.toString();
        span.className = "text";
        span.tabIndex = 0;
        return span;
    }
}
