export default class Thead {
    constructor(FIELD_DEFINITIONS, dataGrid) {
        this.tbody = dataGrid.tbody;
        this.selection = dataGrid.selection;

        this._isDragging = false;
        this._draggingColumn = null;

        this.theadTr = this.create(FIELD_DEFINITIONS);

        return this.theadTr;
    }

    create(definitionData) {
        const fragment = new DocumentFragment();
        const th = document.createElement("th");
        fragment.appendChild(th);

        definitionData.forEach((df) => {
            const th = document.createElement("th");
            th.textContent = df.title;
            this.addThEvents(th);

            fragment.appendChild(th);
        });

        const tr = document.createElement("tr");
        tr.appendChild(fragment);

        return tr;
    }

    addThEvents(th) {
        th.addEventListener("mousedown", this.onThMouseDown.bind(this, th));
        th.addEventListener("mousemove", this.onThMouseMove.bind(this, th));
        th.addEventListener("mouseup", this.onThMouseUp.bind(this, th));
    }

    onThMouseDown(thElement, e) {
        this.selection.clearSelection();
        const colIndex =
            Array.from(thElement.parentNode.children).indexOf(thElement) - 1; // -1 to account for row header
        if (colIndex >= 0) {
            this._isDragging = true;
            this._draggingColumn = colIndex;
            this.selectColumn(colIndex);
            thElement.classList.add("dragging");
        }
    }

    onThMouseMove(thElement, e) {
        if (this._isDragging && this._draggingColumn !== null) {
            const colIndex =
                Array.from(thElement.parentNode.children).indexOf(thElement) -
                1; // -1 to account for row header
            if (colIndex >= 0 && colIndex !== this._draggingColumn) {
                this.moveColumn(colIndex);
                this._draggingColumn = colIndex;
            }
        }
    }

    onThMouseUp(thElement, e) {
        if (this._isDragging && this._draggingColumn !== null) {
            this._isDragging = false;
            this._draggingColumn = null;
            thElement.classList.remove("dragging");
        }
    }

    selectColumn(col) {
        const cells = this.tbody.querySelectorAll(`td[data-col="${col}"]`);
        cells.forEach((cell) => this.selection.selectCell(cell, true));

        // Add class to the selected th
        const th = this.theadTr.querySelector(`th:nth-child(${col + 2})`); // +2 to account for row header and 0-index
        if (th) {
            th.classList.add("selected-th");
        }
    }

    moveColumn(to) {
        const from = this._draggingColumn;
        const rows = this.tbody.querySelectorAll("tr");
        rows.forEach((row) => {
            const cells = Array.from(row.children);
            const fromCell = cells[from + 1]; // +1 to account for row header
            const toCell = cells[to + 1];

            // Move the cell
            row.insertBefore(fromCell, to < from ? toCell : toCell.nextSibling);

            // Update data-col attributes after moving the cell
            fromCell.dataset.col = to;
            toCell.dataset.col = from;

            // Update the _col value for the Cell instance
            if (fromCell.instance) {
                fromCell.instance._col = to;
            }
            if (toCell.instance) {
                toCell.instance._col = from;
            }
        });

        // Move column header
        const headers = this.theadTr.querySelectorAll("th");
        const fromHeader = headers[from + 1];
        const toHeader = headers[to + 1];
        this.theadTr.insertBefore(
            fromHeader,
            to < from ? toHeader : toHeader.nextSibling
        );
    }
}
