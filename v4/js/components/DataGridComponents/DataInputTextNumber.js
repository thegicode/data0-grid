export default class DataInputTextNumber extends HTMLElement {
    constructor(type, value) {
        super();

        this._type = type;
        this._value = value;
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
        const input = document.createElement("input");
        input.type = this._type;
        input.value = this._value;
        input.readOnly = this._readOnly;
        return input;
    }
}
