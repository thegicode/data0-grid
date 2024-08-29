import { iniitialData } from "../data/data.js";
import dataModel from "./DataModel.js";

import Table from "./Table.js";
import Selection from "./Selection.js";
import clipboard from "./clipborad.js";
import handleCsvButton from "./handleCsvButton.js";

export default class DataGrid extends HTMLElement {
    constructor() {
        super();

        this.dataModel = dataModel;
        this.selection = new Selection(this);

        this.table = this.querySelector("table");
        this.thead = this.querySelector("thead");
        this.tbody = this.querySelector("tbody");
        this.csvButton = this.querySelector(".csv-button");
        this.dataButton = this.querySelector(".data-button");

        this.isComposing = false;
    }

    async connectedCallback() {
        try {
            this.dataModel.records = await this.loadData();

            const sortItem = ["id", "name"];
            this.tableCP = new Table(this, sortItem);

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

        this.csvButton.addEventListener(
            "click",
            handleCsvButton.onCsvButtonClick.bind(
                this,
                this.selection,
                this.csvButton
            )
        );

        this.dataButton.addEventListener(
            "click",
            this.onClickShowButton.bind(this)
        );

        document.addEventListener("keydown", this.onKeydown.bind(this));

        this.addEventListener("click", this.onClickDocument.bind(this));
    }

    onKeydown(e) {
        if (e.key === "f" && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            const searchText = prompt("Enter text to search:");
            if (searchText) {
                this.highlightSearchResults(searchText);
            }
        }
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
            this.table,
            this.dataModel
        );
    }

    onClickShowButton(e) {
        this.querySelector("#data-area pre").textContent = JSON.stringify(
            this.dataModel.records,
            null,
            2
        );
    }

    onClickDocument(e) {
        const td = e.target.closest("td");
        if (!td) return;
        const classList = e.target.closest("td").classList;
        if (!classList.contains("highlight")) {
            this.clearHighlights();
        }
    }

    highlightSearchResults(searchText) {
        this.clearHighlights();

        const cells = this.tbody.querySelectorAll("td");
        cells.forEach((cell) => {
            if (cell.instance.value.toString().includes(searchText)) {
                cell.classList.add("highlight");
            }
        });
    }

    clearHighlights() {
        const highlightedCells = this.tbody.querySelectorAll(".highlight");
        highlightedCells.forEach((cell) => {
            cell.classList.remove("highlight");
        });
    }
}
