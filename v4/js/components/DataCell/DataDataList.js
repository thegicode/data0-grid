import DataCellBase from "./DataCellBase.js";

export default class DataDataList extends DataCellBase {
    constructor(params) {
        super(params);
        this._dataListID = `datalist-${this._key}`;
    }

    checkValueType(value) {
        const listElement = document.getElementById(this._dataListID);
        const isIncluded =
            listElement &&
            [...listElement.options].some((option) => option.value === value);
        if (isIncluded) {
            return value;
        }
        return null;
    }

    createElement() {
        const input = document.createElement("input");
        input.type = "text";
        input.setAttribute("list", this._dataListID);
        input.value = this._value;
        input.readOnly = true;
        return input;
    }
}
