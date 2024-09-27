import DataCellBase from "./DataCellBase.js";

export default class DatalistCell extends DataCellBase {
    private _isFix: boolean;
    private _dataListID: string;

    constructor(params: IDataCellParams, isFix = false) {
        super(params);
        this._isFix = isFix;
        this._dataListID = `datalist-${this._key}`;
    }

    createElement() {
        const input = document.createElement("input");
        input.type = "text";
        input.setAttribute("list", this._dataListID);
        input.value = this._value.toString();
        input.readOnly = true;
        return input;
    }
}
