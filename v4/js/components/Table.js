import { FIELD_DEFINITIONS } from "../data/fieldDefinitions.js";
import Cell from "./Cell.js";
import Thead from "./Thead.js";

export default class Table {
    constructor(dataGrid, sortItem) {
        this.dataGrid = dataGrid;
        this.dataModel = dataGrid.dataModel;
        this.selection = dataGrid.selection;
        this.sortItem = sortItem;

        this._selectedTr = null;
        this._fieldDefinitions = FIELD_DEFINITIONS;

        this.theadController = null;

        this.render();
    }

    render() {
        // datalist dom에 생성
        this.checkAndCreateDatalists();

        this.renderTable(this.dataModel.records);
    }

    renderTable(data) {
        this.theadController = new Thead(
            this._fieldDefinitions.map((d) => d.title),
            this.dataGrid,
            this
        );
        this.dataGrid.thead.appendChild(this.theadController.theadTr);

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

        this.theadController.headerOrders.forEach((columnTitle, colIndex) => {
            const field = this._fieldDefinitions.find(
                (d) => d.title === columnTitle
            );
            const type = field ? field.type : "string";

            const params = {
                row: rowIndex,
                col: colIndex,
                title: columnTitle,
                type: type,
                value: rowData[columnTitle] || "", // 값이 없을 경우 빈 문자열로 처리
            };

            // Cell 생성 및 추가
            const cell = new Cell(this, params);
            row.appendChild(cell);
        });

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

    checkAndCreateDatalists() {
        return this._fieldDefinitions
            .filter(({ type }) => type === "datalist")
            .reduce((result, { title }) => {
                result[title] = this.createDataList(title);
                return result;
            }, {});
    }

    createDataList(title) {
        const data = this.dataModel.records.map((item) => item[title]);
        const datalist = document.createElement("datalist");
        datalist.id = `datalist-${title}`;
        data.forEach((item) => {
            const option = document.createElement("option");
            option.value = item;
            datalist.appendChild(option);
        });
        this.dataGrid.appendChild(datalist);
    }
}
