export default class DataDataList extends HTMLElement {
    constructor(title, value) {
        super();

        this._title = title;
        this._type = "datalist";
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
        input.type = "text";
        input.setAttribute("list", `datalist-${this._title}`);
        input.value = this._value;
        input.readOnly = true;
        return input;
    }
}
