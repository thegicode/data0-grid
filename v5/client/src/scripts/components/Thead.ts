import DataGrid from "./DataGrid";
import DataModel from "./models/DataModel";
import Selection from "./Selection";
import Table from "./Table";

export default class Thead {
    public dataModel: DataModel;
    public tbody: HTMLElement | null = null;
    public selection: Selection; // Define the correct type for selection
    public tableController: Table;
    public theadTr: HTMLTableRowElement;
    private sortItem: string[];
    private _headerOrders: string[];
    private _isDragging: boolean;
    private _draggingColumn: number | null;
    private _activeSortButton: HTMLButtonElement | null;

    constructor(
        headerOrders: string[],
        dataGrid: DataGrid,
        tableController: Table
    ) {
        this.dataModel = dataGrid.dataModel;
        if (dataGrid.tbody) this.tbody = dataGrid.tbody;
        this.selection = dataGrid.selection;
        this.tableController = tableController;
        this.sortItem = tableController.sortItem;

        this._headerOrders = headerOrders;
        this._isDragging = false;
        this._draggingColumn = null;
        this._activeSortButton = null;

        this.theadTr = this.createHeader();

        return this;
    }

    get headerOrders(): string[] {
        return this._headerOrders;
    }

    setHeaderOrders(): void {
        const headers = this.theadTr.querySelectorAll("th");
        const columnOrder = Array.from(headers).map(
            (th) => th.textContent || ""
        );
        this._headerOrders = columnOrder.slice(1);
    }

    createHeader(): HTMLTableRowElement {
        const fragment = document.createDocumentFragment();

        // 빈 th
        const rowHeader = document.createElement("th");
        fragment.appendChild(rowHeader);

        this._headerOrders.forEach((name) => {
            const th = document.createElement("th");
            th.textContent = name.toString();

            if (this.sortItem.includes(name)) {
                const sortButton = this.createSortButton(
                    name as keyof IDataItem
                );
                th.appendChild(sortButton);
            }

            this.addThEvents(th);
            fragment.appendChild(th);
        });

        const tr = document.createElement("tr");
        tr.appendChild(fragment);

        return tr;
    }

    addThEvents(th: HTMLElement): void {
        ["mousedown", "mousemove", "mouseup"].forEach((event) => {
            th.addEventListener(event, (e) =>
                this.handleThEvents(th, event, e as MouseEvent)
            );
        });
    }

    handleThEvents(
        thElement: HTMLElement,
        eventType: string,
        e: MouseEvent
    ): void {
        const colIndex =
            Array.from(thElement.parentNode!.children).indexOf(thElement) - 1;

        if (eventType === "mousedown") {
            this.handleThMouseDown(thElement, colIndex);
        } else if (eventType === "mousemove" && this._isDragging) {
            this.handleThMouseMove(colIndex);
        } else if (eventType === "mouseup" && this._isDragging) {
            this.handleThMouseUp(thElement);
        }
    }

    handleThMouseDown(thElement: HTMLElement, colIndex: number): void {
        this.selection.clearSelection();
        if (colIndex >= 0) {
            this._isDragging = true;
            this._draggingColumn = colIndex;
            this.selectColumn(colIndex);
            thElement.classList.add("dragging");
        }
    }

    handleThMouseMove(colIndex: number): void {
        if (colIndex >= 0 && colIndex !== this._draggingColumn) {
            this.moveColumn(colIndex);
            this._draggingColumn = colIndex;
        }
    }

    handleThMouseUp(thElement: HTMLElement): void {
        this._isDragging = false;
        this._draggingColumn = null;
        thElement.classList.remove("dragging");
    }

    selectColumn(col: number): void {
        const cells =
            this.tbody && this.tbody.querySelectorAll(`td[data-col="${col}"]`);
        cells &&
            cells.forEach((cell) =>
                this.selection.selectCell(
                    cell as IHTMLTableCellElementWithInstance,
                    true
                )
            );

        const th = this.theadTr.querySelector(`th:nth-child(${col + 2})`);
        if (th) {
            th.classList.add("selected-th");
        }
    }

    moveColumn(to: number): void {
        const from = this._draggingColumn!;
        const rows = this.tbody?.querySelectorAll("tr");

        rows &&
            rows.forEach((row) => {
                const cells = Array.from(row.children);
                const fromCell = cells[
                    from + 1
                ] as IHTMLTableCellElementWithInstance;
                const toCell = cells[
                    to + 1
                ] as IHTMLTableCellElementWithInstance;

                row.insertBefore(
                    fromCell,
                    to < from ? toCell : toCell.nextSibling
                );

                if (fromCell.instance) fromCell.instance.col = to;
                if (toCell.instance) toCell.instance.col = from;

                // 이유를 알 수 없는 DOM 버그
                const fromElement = fromCell.instance.contentElement;
                if (fromElement && fromElement.children.length > 1) {
                    fromElement.removeChild(fromElement.children[0]);
                }
            });

        const headers = this.theadTr.querySelectorAll("th");
        const fromHeader = headers[from + 1];
        const toHeader = headers[to + 1];
        this.theadTr.insertBefore(
            fromHeader,
            to < from ? toHeader : toHeader.nextSibling
        );

        this.setHeaderOrders();
    }

    createSortButton(columnName: keyof IDataItem) {
        const button = document.createElement("button");
        button.type = "button";
        button.dataset.sort = "";
        button.className = "sort-button";
        button.addEventListener(
            "click",
            this.onClickSortButton.bind(this, columnName, button)
        );
        return button;
    }

    onClickSortButton(columnName: keyof IDataItem, button: HTMLButtonElement) {
        if (this._activeSortButton && this._activeSortButton !== button) {
            this._activeSortButton.dataset.sort = "";
        }

        const sortOrder = this.getNextSortOrder(button.dataset.sort || "");
        const sortedData = this.sortData(columnName, sortOrder);
        const reorderedData = this.sortDataByColumnOrder(sortedData);

        button.dataset.sort = sortOrder;
        this.tableController.renderTbody(reorderedData);

        this._activeSortButton = button;
    }

    getNextSortOrder(currentOrder: string): string {
        return currentOrder === ""
            ? "ascending"
            : currentOrder === "ascending"
            ? "descending"
            : "";
    }

    sortData(columnName: keyof IDataItem, sortOrder: string) {
        if (!sortOrder) return [...this.dataModel.records];

        return [...this.dataModel.records].sort((a, b) => {
            if (a[columnName] < b[columnName])
                return sortOrder === "ascending" ? -1 : 1;
            if (a[columnName] > b[columnName])
                return sortOrder === "ascending" ? 1 : -1;
            return 0;
        });
    }

    sortDataByColumnOrder(sortData: IDataItem[]) {
        return sortData.map((item) => {
            const reorderedItem: any = {};
            this._headerOrders.forEach((columnName) => {
                if (columnName in item) {
                    const value = item[columnName as keyof IDataItem];
                    // 값이 undefined일 때 빈 문자열로 대체
                    reorderedItem[columnName as keyof IDataItem] = value;
                }
            });
            return reorderedItem;
        });
    }
}
