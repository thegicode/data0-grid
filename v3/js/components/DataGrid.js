import { data } from "../data/data.js";
import { dataForms } from "../data/dataForms.js";
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
