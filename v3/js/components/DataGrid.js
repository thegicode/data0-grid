import { data } from "../data/data.js";
import CreateGrid from "./CreateGrid.js";
import DataGridManager from "./DataGridManager.js";

export default class DataGrid extends HTMLElement {
    constructor() {
        super();

        this.table = this.querySelector("table");
        this.thead = this.querySelector("thead");
        this.tbody = this.querySelector("tbody");
    }

    async connectedCallback() {
        const fetchedData = await this.loadData();
        this.manager = new DataGridManager(fetchedData);

        new CreateGrid(this);
    }

    loadData() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(data);
            }, 100);
        });
    }
}
