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
        this._readOnly = value;
        this._el.ariaReadOnly = value;
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.el = this.createElement();
        this.appendChild(this.el);
    }

    createElement() {
        const input = document.createElement("input");
        input.type = "checkbox";
        input.checked = this._value;
        input.ariaReadOnly = this._readOnly;
        return input;
    }
}
