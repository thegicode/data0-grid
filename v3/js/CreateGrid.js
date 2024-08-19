export default class CreateGrid {
    constructor(dataGrid) {
        this.dataGrid = dataGrid;

        // select 엘리먼트 생성하여 반환
        this.selectObject = this.checkAndCreateSelects();

        // datalist dom에 생성
        this.checkAndCreateDatalists();

        this.createThead();
        this.createTbody();
    }

    createThead() {
        const fragment = new DocumentFragment();
        const th = document.createElement("th");
        fragment.appendChild(th);

        this.dataGrid.dataForms.forEach((aDataType) => {
            const th = document.createElement("th");
            th.textContent = aDataType.title;
            fragment.appendChild(th);
        });

        this.dataGrid.thead.appendChild(fragment);
    }

    createTbody() {
        let originalData = [];

        for (let i = 0; i < this.dataGrid.data.length; i++) {
            const row = document.createElement("tr");
            const rowHeader = document.createElement("th");
            rowHeader.textContent = i + 1;
            row.appendChild(rowHeader);

            let rowData = { index: i + 1 };

            for (let j = 0; j < this.dataGrid.dataForms.length; j++) {
                const { cell, cellRowData } = this.createCell(i, j, rowData);
                rowData = cellRowData;
                row.appendChild(cell);
            }

            originalData.push(rowData);

            this.dataGrid.tbody.appendChild(row);
        }
    }

    createCell(i, j, rowData) {
        // rowData 필요없을 것 같음 -> 삭제
        const cell = document.createElement("td");
        cell.dataset.row = i;
        cell.dataset.col = j;

        const currentDataForm = this.dataGrid.dataForms[j];
        const dataValue = this.dataGrid.data[i][currentDataForm.title];

        let input = document.createElement("input");
        switch (currentDataForm.type) {
            case "number":
                input.type = "number";
                input.value = dataValue;
                input.readOnly = true;
                rowData["col" + j] = input.value;
                break;
            case "datalist":
                input.type = "text";
                input.setAttribute(
                    "list",
                    this.datalistId(currentDataForm.title)
                );
                input.value = dataValue;
                input.readOnly = true;
                rowData["col" + j] = input.value;
                break;
            case "select":
                const select = this.selectObject[currentDataForm.title];
                input = select.cloneNode(true);
                input.value = dataValue;
                input.ariaReadOnly = true;
                rowData["col" + j] = input.value;
                break;
            case "checkbox":
                input.type = "checkbox";
                input.checked = Boolean(dataValue);
                input.ariaReadOnly = true;
                rowData["col" + j] = input.checked;
                break;
            default:
                input.type = "text";
                input.value = dataValue;
                rowData["col" + j] = input.value;
                input.readOnly = true;
                break;
        }

        cell.appendChild(input);
        return { cell, cellRowData: rowData };
    }

    checkAndCreateSelects() {
        return this.dataGrid.dataForms
            .filter(({ type }) => type === "select")
            .reduce((result, { title }) => {
                result[title] = this.createSelectElement(title);
                return result;
            }, {});
    }

    createSelectElement(prop) {
        const data = this.dataGrid.data.map((item) => item[prop]);
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
        return this.dataGrid.dataForms
            .filter(({ type }) => type === "datalist")
            .reduce((result, { title }) => {
                result[title] = this.createDataList(title);
                return result;
            }, {});
    }

    createDataList(title) {
        const data = this.dataGrid.data.map((item) => item[title]);
        const datalist = document.createElement("datalist");
        datalist.id = this.datalistId(title);
        data.forEach((item) => {
            const option = document.createElement("option");
            option.value = item;
            datalist.appendChild(option);
        });
        document.body.appendChild(datalist);
    }

    datalistId(text) {
        return `datalist-${text}`;
    }
}
