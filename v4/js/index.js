import DataGrid from "./components/DataGrid.js";
import DataString from "./components/DataCell/DataString.js";
import DataInputTextNumber from "./components/DataCell/DataInputTextNumber.js";
import DataSelect from "./components/DataCell/DataSelect.js";
import DataCheckbox from "./components/DataCell/DataCheckbox.js";
import DataDataList from "./components/DataCell/DataDataList.js";

customElements.define("data-grid", DataGrid);
customElements.define("data-string", DataString);
customElements.define("data-input-text-number", DataInputTextNumber);
customElements.define("data-select", DataSelect);
customElements.define("data-checkbox", DataCheckbox);
customElements.define("data-datalist", DataDataList);
