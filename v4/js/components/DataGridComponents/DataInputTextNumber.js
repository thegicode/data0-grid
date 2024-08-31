import DataCellBase from "./DataCellBase.js";

export default class DataInputTextNumber extends DataCellBase {
    constructor(params) {
        super(params);
    }

    createElement() {
        const input = document.createElement("input");
        input.type = this._type;
        input.value = this._value;
        input.readOnly = this._readOnly;
        return input;
    }
}
