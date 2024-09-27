import DataModel from "./scripts/components/models/DataModel";
import Cell from "./scripts/components/Cell";
import Selection from "./scripts/components/Selection";
import TextNumberCell from "./scripts/components/dataCells/TextNumberCell";
import CheckboxCell from "./scripts/components/dataCells/CheckboxCell";
import SelectCell from "./scripts/components/dataCells/SelectCell";
import DatalistCell from "./scripts/components/dataCells/DatalistCell";
import StringCell from "./scripts/components/dataCells/StringCell";

declare global {
    interface ICellParams {
        row: number;
        col: number;
        type: string;
        key: string;
        value: TDataValue;
    }

    interface IDataItem {
        id: string;
        name: string;
        description: string;
        quantity: number;
        food: string;
        vegetable: string;
        option: boolean;
        ref: string;
    }

    interface IFieldDefinition {
        key: string;
        type: string;
    }

    interface IDataCellParams {
        cellController: Cell;
        dataModel: DataModel;
        selection: Selection;
        type: string;
        key: string;
        value: TDataValue;
    }

    interface IHTMLTableCellElementWithInstance extends HTMLTableCellElement {
        instance: Cell;
    }

    type TDataCell =
        | TextNumberCell
        | CheckboxCell
        | SelectCell
        | DatalistCell
        | StringCell;

    type TDataValue = string | number | boolean;

    type TDataCellElement =
        | HTMLInputElement
        | HTMLSelectElement
        | HTMLDataListElement
        | HTMLElement
        | null;
}
