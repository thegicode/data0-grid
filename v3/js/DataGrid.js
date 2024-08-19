import { data } from "./data.js";
import { dataForms } from "./dataForms.js";
import CreateGrid from "./CreateGrid.js";

export default class DataGrid extends HTMLElement {
    constructor() {
        super();

        this.table = this.querySelector("table");
        this.thead = this.querySelector("thead");
        this.tbody = this.querySelector("tbody");

        this.data = data;
        this.dataForms = dataForms;

        // this.foodDataList = this.data.map((item) => item.food);
        // this.selectListData = this.data.map((item) => item.select);
    }

    connectedCallback() {
        new CreateGrid(this);
        // this.createGrid();
    }

    // createGrid() {
    //     this.createThead();
    //     this.createTbody();
    //     this.createDataList();
    // }

    // createThead() {
    //     const fragment = new DocumentFragment();
    //     const th = document.createElement("th");
    //     fragment.appendChild(th);

    //     this.dataForms.forEach((aDataType) => {
    //         const th = document.createElement("th");
    //         th.textContent = aDataType.title;
    //         fragment.appendChild(th);
    //     });

    //     this.thead.appendChild(fragment);
    // }

    // createTbody() {
    //     let originalData = [];

    //     for (let i = 0; i < this.data.length; i++) {
    //         const row = document.createElement("tr");
    //         const rowHeader = document.createElement("th");
    //         rowHeader.textContent = i + 1;
    //         row.appendChild(rowHeader);

    //         let rowData = { index: i + 1 };

    //         for (let j = 0; j < this.dataForms.length; j++) {
    //             const { cell, cellRowData } = this.createCell(i, j, rowData);
    //             rowData = cellRowData;
    //             row.appendChild(cell);
    //         }

    //         originalData.push(rowData);

    //         this.tbody.appendChild(row);
    //     }
    // }

    // createCell(i, j, rowData) {
    //     const cell = document.createElement("td");
    //     cell.dataset.row = i;
    //     cell.dataset.col = j;

    //     let input = document.createElement("input");
    //     const dataType = this.dataForms[j].type;

    //     const dataValue = this.data[i][this.dataForms[j].title];

    //     switch (dataType) {
    //         case "number":
    //             input.type = "number";
    //             input.value = dataValue;
    //             input.readOnly = true;
    //             rowData["col" + j] = input.value;
    //             break;
    //         case "datalist":
    //             input.type = "text";
    //             input.setAttribute("list", "foodDataList");
    //             input.value = dataValue;
    //             input.readOnly = true;
    //             rowData["col" + j] = input.value;
    //             break;
    //         case "select":
    //             input = this.getSelectElement(i);
    //             input.value = dataValue;
    //             input.ariaReadOnly = true;
    //             rowData["col" + j] = input.value;
    //             break;
    //         case "checkbox":
    //             input.type = "checkbox";
    //             input.checked = Boolean(dataValue);
    //             input.ariaReadOnly = true;
    //             rowData["col" + j] = input.checked;
    //             break;
    //         default:
    //             input.type = "text";
    //             input.value = dataValue;
    //             rowData["col" + j] = input.value;
    //             input.readOnly = true;
    //             break;
    //     }

    //     cell.appendChild(input);
    //     return { cell, cellRowData: rowData };
    // }

    // getSelectElement(i) {
    //     const select = document.createElement("select");
    //     this.selectListData.forEach((name, index) => {
    //         const option = document.createElement("option");
    //         option.textContent = name;
    //         option.value = name;
    //         select.appendChild(option);
    //     });
    //     return select;
    // }

    // createDataList() {
    //     const datalist = document.createElement("datalist");
    //     datalist.id = "foodDataList";
    //     this.foodDataList.forEach((item) => {
    //         const option = document.createElement("option");
    //         option.value = item;
    //         datalist.appendChild(option);
    //     });
    //     document.body.appendChild(datalist);
    // }
}
