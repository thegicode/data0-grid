import { FIELD_DEFINITIONS } from "../data/fieldDefinitions.js";
import Cell from "./Cell.js";
import Thead from "./Thead.js";

export default class Table {
    constructor(dataGrid, sortItem) {
        this.dataGrid = dataGrid;
        this.dataModel = dataGrid.dataModel;
        this.selection = dataGrid.selection;
        this.FIELD_DEFINITIONS = FIELD_DEFINITIONS;
        this.sortItem = sortItem;

        this._columnOrder = this.FIELD_DEFINITIONS.map((d) => d.title);
        this._selectedTr = null;

        this.render();
    }

    get columnOrder() {
        return this._columnOrder;
    }

    render() {
        // select 엘리먼트 생성하여 반환
        this.selectObject = this.checkAndCreateSelects();

        // datalist dom에 생성
        this.checkAndCreateDatalists();

        this.renderTable(this.dataModel.records);
    }

    renderTable(data) {
        const theadTr = new Thead(this._columnOrder, this.dataGrid, this);
        this.dataGrid.thead.appendChild(theadTr);

        this.renderTbody(data);
    }

    renderTbody(data) {
        const bodyFragment = this.createTbody(data);
        this.dataGrid.tbody.innerHTML = "";
        this.dataGrid.tbody.appendChild(bodyFragment);
    }

    createTbody(data) {
        const fragement = new DocumentFragment();
        data.forEach((rowData, rowIndex) => {
            const row = this.craeteRow(rowData, rowIndex);
            fragement.appendChild(row);
        });
        return fragement;
    }

    craeteRow(rowData, rowIndex) {
        const row = document.createElement("tr");
        const rowHeader = this.createRowHeader(rowIndex);
        row.appendChild(rowHeader);

        for (
            let colIndex = 0;
            colIndex < Object.keys(rowData).length;
            colIndex++
        ) {
            const columnTitle = this._columnOrder[colIndex];
            const fieldDefinition = this.FIELD_DEFINITIONS.find(
                (d) => d.title === columnTitle
            );

            const params = {
                row: rowIndex,
                col: colIndex,
                title: fieldDefinition.title,
                type: fieldDefinition.type,
                protected: fieldDefinition.protected,
                value: rowData[fieldDefinition.title],
            };

            const cell = new Cell(this, params);
            row.appendChild(cell);
        }

        return row;
    }

    createRowHeader(rowIndex) {
        const rowHeader = document.createElement("th");
        rowHeader.tabIndex = 0;
        rowHeader.textContent = rowIndex + 1;
        rowHeader.addEventListener("click", this.onClickRowHeader.bind(this));
        return rowHeader;
    }

    onClickRowHeader(e) {
        const clickedRow = e.target.closest("tr"); // Ensure the target is the table row

        if (this._selectedTr) {
            this._selectedTr.classList.remove("selected-tr");
        }

        if (this._selectedTr !== clickedRow) {
            this._selectedTr = clickedRow;
            this._selectedTr.classList.add("selected-tr");
        } else {
            this._selectedTr = null; // Deselect if the same row is clicked
        }
    }

    checkAndCreateSelects() {
        return this.FIELD_DEFINITIONS.filter(
            ({ type }) => type === "select"
        ).reduce((result, { title }) => {
            result[title] = this.createSelectElement(title);
            return result;
        }, {});
    }

    createSelectElement(prop) {
        const data = this.dataModel.records.map((item) => item[prop]);
        const select = document.createElement("select");
        data.forEach((name, index) => {
            const option = document.createElement("option");
            option.textContent = name;
            option.value = name;
            select.appendChild(option);
        });
        return select;
    }

    checkAndCreateDatalists() {
        return this.FIELD_DEFINITIONS.filter(
            ({ type }) => type === "datalist"
        ).reduce((result, { title }) => {
            result[title] = this.createDataList(title);
            return result;
        }, {});
    }

    createDataList(title) {
        const data = this.dataModel.records.map((item) => item[title]);
        const datalist = document.createElement("datalist");
        datalist.id = this.datalistId(title);
        data.forEach((item) => {
            const option = document.createElement("option");
            option.value = item;
            datalist.appendChild(option);
        });
        this.dataGrid.appendChild(datalist);
    }

    setColumnOrder() {
        const headers = this.dataGrid.table.querySelectorAll("thead th");
        const columnOrder = Array.from(headers).map((th) => th.textContent);
        this._columnOrder = columnOrder.slice(1);
    }

    datalistId(text) {
        return `datalist-${text}`;
    }
}
