import DataCellBase from "./DataCellBase.js";

export default class SelectCell extends DataCellBase {
    protected _el: HTMLSelectElement | null = null;

    constructor(params: IDataCellParams) {
        super(params);
    }

    get readOnly() {
        return this._readOnly;
    }

    set readOnly(value) {
        this._readOnly = value;
        if (this._el) this._el.ariaReadOnly = value.toString();
    }

    createElement() {
        const select = document.createElement("select");
        const fragment = new DocumentFragment();
        this.dataModel.records
            .map((data) => this.createOptionElement(data))
            .forEach((optionElement) => fragment.appendChild(optionElement));
        select.appendChild(fragment);
        select.ariaReadOnly = "true";
        select.value = this._value.toString();
        return select;
    }

    createOptionElement(data: IDataItem) {
        const text = data[this._key as keyof IDataItem];
        const option = document.createElement("option");
        option.value = text.toString();
        option.textContent = text.toString();
        return option;
    }

    onChange(e: Event) {
        super.onChange(e);

        this.readOnly = true;
        const nextCell = this.selection.moveTo(
            this.cellController.row + 1,
            this.cellController.col
        );
        if (nextCell) {
            nextCell.instance.readOnly = false;
        }
    }
}
