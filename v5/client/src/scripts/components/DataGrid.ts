import { INITIAL_DATA } from "../data/data";
import Selection from "./Selection";
import DataModel from "./models/DataModel";
import Table from "./Table";
import handleCsvButton from "./helpers/handleCsvButton";
import clipboard from "./helpers/clipboard";

export default class DataGrid extends HTMLElement {
    public dataModel: DataModel;
    public selection: Selection;
    public table: HTMLTableElement;
    public thead: HTMLTableSectionElement | null;
    public tbody: HTMLTableSectionElement | null;
    public csvButton: HTMLButtonElement | null;
    public dataButton: HTMLButtonElement | null;
    public isComposing: boolean;
    public tableCP: Table | null;

    constructor() {
        super();

        this.dataModel = new DataModel();
        this.selection = new Selection(this);

        this.table = this.querySelector("table")!;
        this.thead = this.querySelector("thead");
        this.tbody = this.querySelector("tbody");
        this.csvButton = this.querySelector(
            ".csv-button"
        ) as HTMLButtonElement | null;
        this.dataButton = this.querySelector(
            ".data-button"
        ) as HTMLButtonElement | null;

        this.isComposing = false;
        this.tableCP = null;
    }

    async connectedCallback() {
        try {
            this.dataModel.records = await this.loadData();

            const sortItem = ["id", "name"];
            this.tableCP = new Table(this, sortItem);

            const firstCell = this.tbody?.querySelector(
                "td"
            ) as IHTMLTableCellElementWithInstance;
            if (firstCell) {
                this.selection.selectCell(firstCell); // 초기 선택
            }

            this.bindEvents();
        } catch (error) {
            console.error("Data loading failed", error);
        }
    }

    set csvButtonVisible(value: boolean) {
        if (this.csvButton) {
            this.csvButton.hidden = !value;
        }
    }

    async loadData(): Promise<IDataItem[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(INITIAL_DATA);
            }, 100);
        });
    }

    bindEvents() {
        document.addEventListener("copy", this.onCopy.bind(this));
        document.addEventListener("paste", this.onPaste.bind(this));
        if (this.csvButton) {
            this.csvButton.addEventListener(
                "click",
                handleCsvButton.onCsvButtonClick.bind(
                    this,
                    this.selection,
                    this.csvButton
                )
            );
        }

        if (this.dataButton) {
            this.dataButton.addEventListener(
                "click",
                this.onClickShowButton.bind(this)
            );
        }

        document.addEventListener("keydown", this.onKeydown.bind(this));

        this.addEventListener("click", this.onClickDocument.bind(this));
    }

    onKeydown(e: KeyboardEvent) {
        if (e.key === "f" && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            const searchText = prompt("Enter text to search:");
            if (searchText) {
                this.highlightSearchResults(searchText);
            }
        }
    }

    onCopy(e: ClipboardEvent) {
        e.preventDefault();
        clipboard.copyCells(this.selection);
    }

    onPaste(e: ClipboardEvent) {
        e.preventDefault();
        clipboard.pasteCells(this.table, this.dataModel, this.selection);
    }

    onClickShowButton(e: MouseEvent) {
        const pre = this.querySelector("#data-area pre");
        if (pre) {
            pre.textContent = JSON.stringify(this.dataModel.records, null, 2);
        }
    }

    onClickDocument(e: MouseEvent) {
        const td = (e.target as HTMLElement).closest("td");
        if (!td) return;
        const classList = td.classList;
        if (!classList.contains("highlight")) {
            this.clearHighlights();
        }
    }

    highlightSearchResults(searchText: string) {
        this.clearHighlights();

        const cells = this.tbody?.querySelectorAll(
            "td"
        ) as NodeListOf<IHTMLTableCellElementWithInstance>;
        cells?.forEach((cell) => {
            const instance = cell.instance;
            if (instance?.value?.toString().includes(searchText)) {
                cell.classList.add("highlight");
            }
        });
    }

    clearHighlights() {
        const highlightedCells = this.tbody?.querySelectorAll(".highlight");
        highlightedCells?.forEach((cell) => {
            cell.classList.remove("highlight");
        });
    }
}

// Make sure to declare or import types for `INITIAL_DATA`, `clipboard`, and `handleCsvButton`.
