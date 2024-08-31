export default class DataText extends HTMLElement {
    constructor(value) {
        super();

        this._value = value;
        this._el = null;
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this._el = this.createElement();
        this.appendChild(this._el);
    }

    createElement() {
        const span = document.createElement("span");
        span.textContent = this._value;
        span.className = "text";
        span.tabIndex = 0;
        return span;
    }
}
