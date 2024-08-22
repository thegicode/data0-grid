import { iniitialData } from "../data/data.js";
import dataManager from "./DataManager.js";

import Table from "./Table.js";
import Selection from "./Selection.js";
import clipboard from "./clipborad.js";

export default class DataGrid extends HTMLElement {
    constructor() {
        super();

        this.manager = dataManager;
        this.selection = new Selection(this);

        this.table = this.querySelector("table");
        this.thead = this.querySelector("thead");
        this.tbody = this.querySelector("tbody");
        this.csvButton = this.querySelector(".csv-button");

        this.isComposing = false;
    }

    async connectedCallback() {
        try {
            this.manager.data = await this.loadData();
            new Table(this);
            this.selection.selectCell(this.tbody.querySelector("td")); // 초기 선택
            this.bindEvents();
        } catch (error) {
            console.error("Data loading failed", error);
        }
    }

    set csvButtonVisible(value) {
        this.csvButton.hidden = !Boolean(value);
    }

    async loadData() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(iniitialData);
            }, 100);
        });
    }

    bindEvents() {
        document.addEventListener("copy", this.onCopy.bind(this));
        document.addEventListener("paste", this.onPaste.bind(this));
    }

    onCopy(e) {
        e.preventDefault();
        clipboard.copyCells(
            this.selection.selectedCells,
            this.selection.currentSelectionRange
        );
    }

    onPaste(e) {
        e.preventDefault();
        clipboard.pasteCells(
            this.selection.selectedCells,
            this.tbody,
            this.manager
        );
    }
}
