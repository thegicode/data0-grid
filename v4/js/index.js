import DataGrid from "./components/DataGrid.js";
import DataText from "./components/DataGridComponents/DataText.js";
import DataInputTextNumber from "./components/DataGridComponents/DataInputTextNumber.js";
import DataSelect from "./components/DataGridComponents/DataSelect.js";
import DataCheckbox from "./components/DataGridComponents/DataCheckbox.js";
import DataDataList from "./components/DataGridComponents/DataDataList.js";

customElements.define("data-grid", DataGrid);
customElements.define("data-text", DataText);
customElements.define("data-input-text-number", DataInputTextNumber);
customElements.define("data-select", DataSelect);
customElements.define("data-checkbox", DataCheckbox);
customElements.define("data-datalist", DataDataList);
