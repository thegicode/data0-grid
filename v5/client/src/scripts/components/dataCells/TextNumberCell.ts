import DataCellBase from "./DataCellBase";

export default class TextNumberCell extends DataCellBase {
    constructor(params: IDataCellParams) {
        super(params);
    }

    // set value(arg: TDataValue) {
    //     if (this._type === "number") {
    //         this._value = Number(arg);
    //     }
    // }

    createElement() {
        const input = document.createElement("input");
        input.type = this._type;
        input.value = this._value.toString();
        input.readOnly = this._readOnly;
        return input;
    }
}
