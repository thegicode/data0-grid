import DataCellBase from "./DataCellBase";

export default class TextNumberCell extends DataCellBase {
    constructor(params: IDataCellParams) {
        super(params);
    }

    checkValueType(arg: string): string | number | null {
        if (this._type === "number") {
            const newValue = Number(arg);
            return isNaN(newValue) ? null : newValue; // 숫자가 아닌 값은 null 반환
        } else if (this._type === "text") {
            return arg && typeof arg === "string" ? arg : null; // 비어있지 않은 문자열만 반환
        } else {
            return null; // 예상치 못한 타입은 null 반환
        }
    }

    createElement() {
        const input = document.createElement("input");
        input.type = this._type;
        input.value = this._value;
        input.readOnly = this._readOnly;
        return input;
    }
}
