import CheckboxCell from "../components/dataCells/CheckboxCell";
import DatalistCell from "../components/dataCells/DatalistCell";
import SelectCell from "../components/dataCells/SelectCell";
import StringCell from "../components/dataCells/StringCell";
import TextNumberCell from "../components/dataCells/TextNumberCell";
import DataGrid from "../components/DataGrid";

customElements.define("data-grid", DataGrid);
customElements.define("string-cell", StringCell);
customElements.define("text-number-cell", TextNumberCell);
customElements.define("select-cell", SelectCell);
customElements.define("checkbox-cell", CheckboxCell);
customElements.define("datalist-cell", DatalistCell);
