import { data } from "../data/data.js";
import CreateGrid from "./CreateGrid.js";
import Selection from "./Selection.js";

import DataGridManager from "./DataGridManager.js";

export default class DataGrid extends HTMLElement {
    constructor() {
        super();

        this.table = this.querySelector("table");
        this.thead = this.querySelector("thead");
        this.tbody = this.querySelector("tbody");

        this.csvButton = this.querySelector(".csv-button");
    }

    async connectedCallback() {
        const fetchedData = await this.loadData();

        this.manager = new DataGridManager(fetchedData);
        this.selection = new Selection(this);

        new CreateGrid(this);

        // 초기 선택
        this.selection.selectCell(this.tbody.querySelector("td"));
    }

    loadData() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(data);
            }, 100);
        });
    }

    set csvButtonVisible(value) {
        this.csvButton.hidden = !Boolean(value);
    }
}
