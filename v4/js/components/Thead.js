export default class Thead {
    constructor(headerOrders, dataGrid, tableController) {
        this.dataModel = dataGrid.dataModel;
        this.tbody = dataGrid.tbody;
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

    get headerOrders() {
        return this._headerOrders;
    }

    setHeaderOrders() {
        const headers = this.theadTr.querySelectorAll("th");
        const columnOrder = Array.from(headers).map((th) => th.textContent);
        this._headerOrders = columnOrder.slice(1);
    }

    createHeader() {
        const fragment = document.createDocumentFragment();

        // 빈 th
        const rowHeader = document.createElement("th");
        fragment.appendChild(rowHeader);

        this._headerOrders.forEach((name) => {
            const th = document.createElement("th");
            th.textContent = name;

            if (this.sortItem.includes(name)) {
                const sortButton = this.createSortButton(name);
                th.appendChild(sortButton);
            }

            this.addThEvents(th);
            fragment.appendChild(th);
        });

        const tr = document.createElement("tr");
        tr.appendChild(fragment);

        return tr;
    }

    addThEvents(th) {
        ["mousedown", "mousemove", "mouseup"].forEach((event) => {
            th.addEventListener(event, (e) =>
                this.handleThEvents(th, event, e)
            );
        });
    }

    handleThEvents(thElement, eventType, e) {
        const colIndex =
            Array.from(thElement.parentNode.children).indexOf(thElement) - 1;

        if (eventType === "mousedown") {
            this.handleThMouseDown(thElement, colIndex);
        } else if (eventType === "mousemove" && this._isDragging) {
            this.handleThMouseMove(colIndex);
        } else if (eventType === "mouseup" && this._isDragging) {
            this.handleThMouseUp(thElement);
        }
    }

    handleThMouseDown(thElement, colIndex) {
        this.selection.clearSelection();
        if (colIndex >= 0) {
            this._isDragging = true;
            this._draggingColumn = colIndex;
            this.selectColumn(colIndex);
            thElement.classList.add("dragging");
        }
    }

    handleThMouseMove(colIndex) {
        if (colIndex >= 0 && colIndex !== this._draggingColumn) {
            this.moveColumn(colIndex);
            this._draggingColumn = colIndex;
        }
    }

    handleThMouseUp(thElement) {
        this._isDragging = false;
        this._draggingColumn = null;
        thElement.classList.remove("dragging");
    }

    selectColumn(col) {
        const cells = this.tbody.querySelectorAll(`td[data-col="${col}"]`);
        cells.forEach((cell) => this.selection.selectCell(cell, true));

        const th = this.theadTr.querySelector(`th:nth-child(${col + 2})`);
        if (th) {
            th.classList.add("selected-th");
        }
    }

    moveColumn(to) {
        const from = this._draggingColumn;
        const rows = this.tbody.querySelectorAll("tr");

        rows.forEach((row) => {
            const cells = Array.from(row.children);
            const fromCell = cells[from + 1];
            const toCell = cells[to + 1];

            row.insertBefore(fromCell, to < from ? toCell : toCell.nextSibling);

            if (fromCell.instance) fromCell.instance.col = to;
            if (toCell.instance) toCell.instance.col = from;

            // 이유를 알 수 없는 dom 버그
            const fromDataCell = fromCell.instance.dataCell;
            if (fromDataCell.children.length > 1) {
                fromDataCell.removeChild(fromDataCell.children[0]);
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

    createSortButton(columnName) {
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

    onClickSortButton(columnName, button) {
        if (this._activeSortButton && this._activeSortButton !== button) {
            this._activeSortButton.dataset.sort = "";
        }

        const sortOrder = this.getNextSortOrder(button.dataset.sort);
        const sortedData = this.sortData(columnName, sortOrder);
        const reorderedData = this.sortDataByColumnOrder(sortedData);

        button.dataset.sort = sortOrder;
        this.tableController.renderTbody(reorderedData);

        this._activeSortButton = button;
    }

    getNextSortOrder(currentOrder) {
        return currentOrder === ""
            ? "ascending"
            : currentOrder === "ascending"
            ? "descending"
            : "";
    }

    sortData(columnName, sortOrder) {
        if (!sortOrder) return [...this.dataModel.records];

        return [...this.dataModel.records].sort((a, b) => {
            if (a[columnName] < b[columnName])
                return sortOrder === "ascending" ? -1 : 1;
            if (a[columnName] > b[columnName])
                return sortOrder === "ascending" ? 1 : -1;
            return 0;
        });
    }

    sortDataByColumnOrder(sortData) {
        return sortData.map((item) => {
            const reorderedItem = {};
            this._headerOrders.forEach((columnName) => {
                reorderedItem[columnName] = item[columnName];
            });
            return reorderedItem;
        });
    }
}
