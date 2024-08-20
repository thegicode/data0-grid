import { FIELD_DEFINITIONS } from "../data/fieldDefinitions.js";
import Cell from "./Cell.js";
import Thead from "./Thead.js";

export default class CreateGrid {
    constructor(dataGrid) {
        this.dataGrid = dataGrid;
        this.manager = dataGrid.manager;
        this.selection = dataGrid.selection;
        this.FIELD_DEFINITIONS = FIELD_DEFINITIONS;

        // select 엘리먼트 생성하여 반환
        this.selectObject = this.checkAndCreateSelects();

        // datalist dom에 생성
        this.checkAndCreateDatalists();

        this.createThead();
        this.createTbody();
    }

    createThead() {
        const theadTr = new Thead(this.FIELD_DEFINITIONS, this.dataGrid);
        this.dataGrid.thead.appendChild(theadTr);
    }

    createTbody() {
        for (let i = 0; i < this.manager.data.length; i++) {
            const row = document.createElement("tr");
            const rowHeader = document.createElement("th");
            rowHeader.textContent = i + 1;
            row.appendChild(rowHeader);

            for (let j = 0; j < this.FIELD_DEFINITIONS.length; j++) {
                const cell = new Cell(this, i, j);
                row.appendChild(cell);
            }

            this.dataGrid.tbody.appendChild(row);
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
        const data = this.manager.data.map((item) => item[prop]);
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
        const data = this.manager.data.map((item) => item[title]);
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
