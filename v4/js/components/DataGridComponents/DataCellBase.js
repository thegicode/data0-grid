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

    get value() {
        return this._value;
    }

    set value(arg) {
        this._value = arg;
        this._el.value = arg;
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
}
