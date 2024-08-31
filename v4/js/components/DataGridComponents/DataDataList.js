import DataCellBase from "./DataCellBase.js";

export default class DataDataList extends DataCellBase {
    constructor(params) {
        super(params);
    }

    createElement() {
        const input = document.createElement("input");
        input.type = "text";
        input.setAttribute("list", `datalist-${this._title}`);
        input.value = this._value;
        input.readOnly = true;
        return input;
    }
}
