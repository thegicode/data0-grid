export default class DataSelect extends HTMLElement {
    constructor(dataModel, title, value) {
        super();

        this.dataModel = dataModel;

        this._title = title;
        this._type = "select";
        this._value = value;

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
        const select = document.createElement("select");
        const fragment = new DocumentFragment();
        this.dataModel.records
            .map((data) => this.createOptionElement(data))
            .forEach((optionElement) => fragment.appendChild(optionElement));
        select.appendChild(fragment);
        select.ariaReadOnly = true;
        select.value = this._value;
        return select;
    }

    createOptionElement(data) {
        const text = data[this._title];
        const option = document.createElement("option");
        option.value = text;
        option.textContent = text;
        return option;
    }
}
