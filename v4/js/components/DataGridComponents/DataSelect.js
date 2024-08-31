import DataCellBase from "./DataCellBase.js";

export default class DataSelect extends DataCellBase {
    constructor(params) {
        super(params);
    }

    set readOnly(value) {
        this._readOnly = value;
        this._el.ariaReadOnly = value;
    }

    createElement() {
        const select = document.createElement("select");
        const fragment = new DocumentFragment();
        this.dataModel.records
            .map((data) => this.createOptionElement(data))
            .forEach((optionElement) => fragment.appendChild(optionElement));
        select.appendChild(fragment);
        select.ariaReadOnly = true;
        select.value = this._value;
        return select;
    }

    createOptionElement(data) {
        const text = data[this._title];
        const option = document.createElement("option");
        option.value = text;
        option.textContent = text;
        return option;
    }
}
