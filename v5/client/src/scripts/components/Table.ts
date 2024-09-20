import { FIELD_DEFINITIONS } from "../data/fieldDefinitions"; // fieldDefinitions에 타입 정의 추가
import Cell from "./Cell";
import Thead from "./Thead";
import DataGrid from "./DataGrid";
import Selection from "./Selection";
import DataModel from "./models/DataModel";

interface TableParams {
    dataGrid: DataGrid;
    sortItem: string[];
}

export default class Table {
    public dataGrid: DataGrid;
    public dataModel: DataModel;
    public selection: Selection;
    public sortItem: string[];
    public theadController: Thead | null;

    private _fieldDefinitions: IFieldDefinition[];
    private _selectedTr: HTMLTableRowElement | null;

    constructor(dataGrid: DataGrid, sortItem: string[]) {
        this.dataGrid = dataGrid;
        this.dataModel = dataGrid.dataModel;
        this.selection = dataGrid.selection;
        this.sortItem = sortItem;
        this.theadController = null;

        this._fieldDefinitions = FIELD_DEFINITIONS;
        this._selectedTr = null;

        this.render();
    }

    render() {
        // datalist dom에 생성
        this.checkAndCreateDatalists();

        this.renderTable(this.dataModel.records);
    }

    renderTable(data: IDataItem[]) {
        this.theadController = new Thead(
            this._fieldDefinitions.map((d) => d.key),
            this.dataGrid,
            this
        );
        this.dataGrid.thead?.appendChild(this.theadController.theadTr);

        this.renderTbody(data);
    }

    renderTbody(data: IDataItem[]) {
        const bodyFragment = this.createTbody(data);
        if (!this.dataGrid.tbody) return;
        this.dataGrid.tbody.innerHTML = "";
        this.dataGrid.tbody.appendChild(bodyFragment);
    }

    createTbody(data: IDataItem[]): DocumentFragment {
        const fragment = new DocumentFragment();
        data.forEach((rowData, rowIndex) => {
            const row = this.createRow(rowData, rowIndex);
            fragment.appendChild(row);
        });
        return fragment;
    }

    createRow(rowData: IDataItem, rowIndex: number): HTMLTableRowElement {
        const row = document.createElement("tr");
        const rowHeader = this.createRowHeader(rowIndex);
        row.appendChild(rowHeader);

        this.theadController?.headerOrders.forEach((columnKey, colIndex) => {
            const field = this._fieldDefinitions.find(
                (d) => d.key === columnKey
            );
            const type = field ? field.type : "string";
            const key = columnKey as keyof IDataItem;
            const params = {
                row: rowIndex,
                col: colIndex,
                key: columnKey,
                type: type,
                value: rowData[key],
            };

            // Cell 생성 및 추가
            const cell = new Cell(this, params, row);
            if (cell.cellElement) {
                row.appendChild(cell.cellElement);
            }
        });

        return row;
    }

    createRowHeader(rowIndex: number): HTMLTableHeaderCellElement {
        const rowHeader = document.createElement("th");
        rowHeader.tabIndex = 0;
        rowHeader.textContent = (rowIndex + 1).toString();
        rowHeader.addEventListener("click", this.onClickRowHeader.bind(this));
        return rowHeader;
    }

    onClickRowHeader(e: MouseEvent): void {
        const clickedRow = (e.target as HTMLElement).closest("tr");

        if (this._selectedTr) {
            this._selectedTr.classList.remove("selected-tr");
        }

        if (this._selectedTr !== clickedRow) {
            this._selectedTr = clickedRow as HTMLTableRowElement;
            this._selectedTr.classList.add("selected-tr");
        } else {
            this._selectedTr = null; // Deselect if the same row is clicked
        }
    }

    checkAndCreateDatalists(): Record<string, HTMLDataListElement> {
        return this._fieldDefinitions
            .filter(({ type }) => type === "datalist")
            .reduce((result, { key }) => {
                result[key] = this.createDataList(key);
                return result;
            }, {} as Record<string, HTMLDataListElement>);
    }

    createDataList(key: string): HTMLDataListElement {
        const data = this.dataModel.records.map(
            (item: IDataItem) => item[key as keyof IDataItem]
        );
        const datalist = document.createElement("datalist");
        datalist.id = `datalist-${key}`;
        data.forEach((item) => {
            const option = document.createElement("option");
            option.value = item.toString();
            datalist.appendChild(option);
        });
        this.dataGrid.appendChild(datalist);
        return datalist;
    }
}
