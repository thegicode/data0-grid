export default class Cell {
    constructor(createGrid, i, j) {
        const currentField = createGrid.FIELD_DEFINITIONS[j];
        const dataValue = createGrid.manager.data[i][currentField.title];

        this.createGrid = createGrid;
        this.row = i;
        this.col = j;
        this.type = currentField.type;
        this.title = currentField.title;
        this.value = dataValue;

        return this.createCell();
    }

    createCell() {
        const cell = document.createElement("td");
        cell.dataset.row = this.row;
        cell.dataset.col = this.col;

        const input = this.createInput();

        cell.appendChild(input);
        return cell;
    }

    createInput() {
        let input = document.createElement("input");
        switch (this.type) {
            case "number":
                input.type = "number";
                input.value = this.value;
                input.readOnly = true;
                break;
            case "datalist":
                input.type = "text";
                input.setAttribute(
                    "list",
                    this.createGrid.datalistId(this.title)
                );
                input.value = this.value;
                input.readOnly = true;
                break;
            case "select":
                const select = this.createGrid.selectObject[this.title];
                input = select.cloneNode(true);
                input.value = this.value;
                input.ariaReadOnly = true;
                break;
            case "checkbox":
                input.type = "checkbox";
                input.checked = Boolean(this.value);
                input.ariaReadOnly = true;
                break;
            default:
                input.type = "text";
                input.value = this.value;
                input.readOnly = true;
                break;
        }
        return input;
    }
}
