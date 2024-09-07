import DataGrid from "./components/DataGrid.js";
import StringCell from "./components/DataCells/StringCell.js";
import TextNumberCell from "./components/DataCells/TextNumberCell.js";
import SelectCell from "./components/DataCells/SelectCell.js";
import CheckboxCell from "./components/DataCells/CheckboxCell.js";
import DatalistCell from "./components/DataCells/DatalistCell.js";

customElements.define("data-grid", DataGrid);
customElements.define("string-cell", StringCell);
customElements.define("text-number-cell", TextNumberCell);
customElements.define("select-cell", SelectCell);
customElements.define("checkbox-cell", CheckboxCell);
customElements.define("datalist-cell", DatalistCell);
