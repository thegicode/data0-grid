import DataCellBase from "./DataCellBase.js";

export default class DatalistCell extends DataCellBase {
    private _dataListID: string;

    private _isFix: boolean;

    constructor(params: IDataCellParams, isFix = false) {
        super(params);
        this._isFix = isFix;
        this._dataListID = `datalist-${this._key}`;
    }

    get getAvailableOptions() {
        const keyString = this._key;
        return this.dataModel.getValuesForKey(keyString);
    }

    get currentInputValue() {
        if (this._el instanceof HTMLInputElement) {
            if (
                this._isFix &&
                !this.getAvailableOptions.includes(this._el.value)
            ) {
                this._el.value = this._value.toString();
            } else return this._el.value;
        }
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
