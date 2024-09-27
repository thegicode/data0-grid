import DataCellBase from "./DataCellBase";

export default class TextNumberCell extends DataCellBase {
    constructor(params: IDataCellParams) {
        super(params);
    }

    createElement() {
        const input = document.createElement("input");
        input.type = this._type;
        input.value = this._value.toString();
        input.readOnly = this._readOnly;
        return input;
    }
}
