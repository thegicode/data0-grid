import { data } from "./data.js";
import { dataForms } from "./dataForms.js";
import CreateGrid from "./CreateGrid.js";

export default class DataGrid extends HTMLElement {
    constructor() {
        super();

        this.table = this.querySelector("table");
        this.thead = this.querySelector("thead");
        this.tbody = this.querySelector("tbody");

        this.data = data;
        this.dataForms = dataForms;
    }

    connectedCallback() {
        new CreateGrid(this);
    }
}
