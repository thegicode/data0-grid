import { data } from "../data/data.js";
import CreateGrid from "./CreateGrid.js";
import Selection from "./Selection.js";
import clipboard from "./clipborad.js";

import DataGridManager from "./DataGridManager.js";

export default class DataGrid extends HTMLElement {
    constructor() {
        super();

        this.table = this.querySelector("table");
        this.thead = this.querySelector("thead");
        this.tbody = this.querySelector("tbody");
        this.csvButton = this.querySelector(".csv-button");

        this.isComposing = false;
    }

    async connectedCallback() {
        const fetchedData = await this.loadData();

        this.manager = new DataGridManager(fetchedData);
        this.selection = new Selection(this);

        new CreateGrid(this);

        // 초기 선택
        this.selection.selectCell(this.tbody.querySelector("td"));

        this.addEvents();
    }

    set csvButtonVisible(value) {
        this.csvButton.hidden = !Boolean(value);
    }

    loadData() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(data);
            }, 100);
        });
    }

    addEvents() {
        document.addEventListener("copy", (e) => {
            e.preventDefault();
            clipboard.copyCells(
                this.selection.selectedCells,
                this.selection.currentSelectionRange
            );
        });

        document.addEventListener("paste", (e) => {
            e.preventDefault();
            clipboard.pasteCells(this.selection.selectedCells, this.tbody);
        });
    }
}
