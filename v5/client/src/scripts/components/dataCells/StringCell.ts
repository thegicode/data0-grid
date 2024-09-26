import DataCellBase from "./DataCellBase.js";

export default class StringCell extends DataCellBase {
    constructor(params: IDataCellParams) {
        super(params);
    }

    get value() {
        return this._value;
    }

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
