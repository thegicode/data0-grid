import DataGrid from "./components/DataGrid.js";
import DataString from "./components/DataGridComponents/DataString.js";
import DataInputTextNumber from "./components/DataGridComponents/DataInputTextNumber.js";
import DataSelect from "./components/DataGridComponents/DataSelect.js";
import DataCheckbox from "./components/DataGridComponents/DataCheckbox.js";
import DataDataList from "./components/DataGridComponents/DataDataList.js";

customElements.define("data-grid", DataGrid);
customElements.define("data-string", DataString);
customElements.define("data-input-text-number", DataInputTextNumber);
customElements.define("data-select", DataSelect);
customElements.define("data-checkbox", DataCheckbox);
customElements.define("data-datalist", DataDataList);
