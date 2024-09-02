export default class DataCellBase extends HTMLElement {
    constructor(params) {
        super();

        this.dataModel = params.dataModel;

        this._type = params.type;
        this._title = params.title;
        this._value = params.value;

        this._readOnly = true;
        this._el = null;
    }

    get readOnly() {
        return this._readOnly;
    }

    set readOnly(value) {
        this._readOnly = value;
        this._el.readOnly = value;
    }

    get title() {
        return this._title;
    }

    get value() {
        return this._value;
    }

    set value(arg) {
        const newValue = this.checkValueType(arg);

        // newValue가 null 또는 undefined인 경우 반환
        if (newValue === null || newValue === undefined) return;

        // 유효한 값이 있을 때만 값을 설정
        this._value = newValue;
        this._el.value = newValue;
    }

    get currentValue() {
        return this._el.value;
    }

    focus() {
        this._el.focus();
    }

    blur() {
        this._el.blur();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this._el = this.createElement();
        this.appendChild(this._el);
    }

    createElement() {
        //
    }

    checkValueType() {
        //
    }
}
