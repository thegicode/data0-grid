export default class DataCheckbox extends HTMLElement {
    constructor(value) {
        super();

        this._type = "checkbox";
        this._value = Boolean(value);
        this._readOnly = true;
        this._el = null;
    }

    get readOnly() {
        return this._readOnly;
    }

    set readOnly(value) {
        this._readOnly = Boolean(value);
        this._el.ariaReadOnly = Boolean(value);
    }

    get value() {
        return this._value;
    }

    set value(arg) {
        this._value = Boolean(arg);
        this._el.checked = Boolean(arg);
    }

    get currentValue() {
        return this._el.checked;
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
        input.type = "checkbox";
        input.checked = this._value;
        input.ariaReadOnly = this._readOnly;
        return input;
    }
}
