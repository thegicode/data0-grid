export default class Cell {
    constructor(createGrid, i, j) {
        const currentField = createGrid.FIELD_DEFINITIONS[j];

        this.createGrid = createGrid;
        this.row = i;
        this.col = j;
        this.type = currentField.type;
        this.title = currentField.title;
        this.value = createGrid.manager.data[i][this.title];

        return this.createCell();
    }

    createCell() {
        const cell = document.createElement("td");
        cell.dataset.row = this.row;
        cell.dataset.col = this.col;
        const input = this.createInput();
        cell.appendChild(input);

        this.input = input;
        this.cell = cell;
        this.addEvents();

        return cell;
    }

    createInput() {
        let input = document.createElement("input");
        switch (this.type) {
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
            default: // text, number
                input.type = this.type;
                input.value = this.value;
                input.readOnly = true;
                break;
        }
        return input;
    }

    addEvents() {
        this.cell.addEventListener("dblclick", this.onDBClick.bind(this));
    }

    onDBClick() {
        if (this.input) {
            // if (input.ariaReadOnly === "true") {
            //     input.ariaReadOnly = "false";
            // } else {
            this.input.readOnly = false;
            // }
            this.input.focus();
        }
    }
}
