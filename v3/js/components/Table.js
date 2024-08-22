import { FIELD_DEFINITIONS } from "../data/fieldDefinitions.js";
import Cell from "./Cell.js";
import Thead from "./Thead.js";

export default class Table {
    constructor(dataGrid) {
        this.dataGrid = dataGrid;
        this.dataModel = dataGrid.dataModel;
        this.selection = dataGrid.selection;
        this.FIELD_DEFINITIONS = FIELD_DEFINITIONS;

        this.render();
    }

    render() {
        // select 엘리먼트 생성하여 반환
        this.selectObject = this.checkAndCreateSelects();

        // datalist dom에 생성
        this.checkAndCreateDatalists();

        const theadTr = new Thead(this.FIELD_DEFINITIONS, this.dataGrid);
        const bodyFragment = this.createTbody();

        this.dataGrid.thead.appendChild(theadTr);
        this.dataGrid.tbody.appendChild(bodyFragment);
    }

    createTbody() {
        const fragement = new DocumentFragment();
        const fieldCount = this.FIELD_DEFINITIONS.length;

        this.dataModel.records.forEach((_, rowIndex) => {
            const row = this.craeteRow(rowIndex, fieldCount);
            fragement.appendChild(row);
        });

        return fragement;
    }

    craeteRow(rowIndex, fieldCount) {
        const row = document.createElement("tr");
        const rowHeader = this.createRowHeader(rowIndex);
        row.appendChild(rowHeader);

        for (let colIndex = 0; colIndex < fieldCount; colIndex++) {
            const cell = new Cell(this, rowIndex, colIndex);
            row.appendChild(cell);
        }

        return row;
    }

    createRowHeader(rowIndex) {
        const rowHeader = document.createElement("th");
        rowHeader.textContent = rowIndex + 1;
        return rowHeader;
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

    datalistId(text) {
        return `datalist-${text}`;
    }
}
