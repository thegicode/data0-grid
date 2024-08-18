export const ingredients = [
    "사과",
    "바나나",
    "당근",
    "다시마",
    "계란",
    "감자",
    "토마토",
    "양파",
    "호박",
    "오이",
];

export let originalData = [];

export function createGrid(tbody, rows, cols) {
    originalData = [];
    for (let i = 0; i < rows; i++) {
        const row = document.createElement("tr");
        const rowHeader = document.createElement("th");
        rowHeader.textContent = i + 1;
        row.appendChild(rowHeader);

        let rowData = { index: i + 1 };

        for (let j = 0; j < cols; j++) {
            const cell = document.createElement("td");
            cell.dataset.row = i;
            cell.dataset.col = j;

            let input = document.createElement("input");

            switch (j) {
                case 1:
                    input.type = "number";
                    input.value = i + j;
                    input.readOnly = true;
                    rowData["col" + j] = input.value;
                    break;
                case 2:
                    input.type = "text";
                    input.setAttribute("list", "ingredientList");
                    input.value = ingredients[i];
                    input.readOnly = true;
                    rowData["col" + j] = input.value;
                    break;
                case 3:
                    input = document.createElement("select");
                    input.name = "select-list";
                    ingredients
                        .map((name, index) => {
                            const option = document.createElement("option");
                            option.value = name;
                            option.textContent = name;
                            if (i === index) option.selected = true;
                            return option;
                        })
                        .forEach((el) => {
                            input.appendChild(el);
                        });
                    input.ariaReadOnly = true;
                    rowData["col" + j] = input.value;
                    break;
                case 4:
                    input.type = "checkbox";
                    if (i % 2 === 0) input.checked = true;
                    input.ariaReadOnly = true;
                    rowData["col" + j] = input.checked;
                    break;
                default:
                    input.type = "text";
                    input.value = `s-${i}${j}`;
                    input.readOnly = true;
                    rowData["col" + j] = input.value;
                    break;
            }

            cell.appendChild(input);
            row.appendChild(cell);
        }
        originalData.push(rowData);
        tbody.appendChild(row);
    }
}

export function renderTable(tbody, data) {
    tbody.innerHTML = "";
    data.forEach((row, rowIndex) => {
        const tr = document.createElement("tr");
        const rowHeader = document.createElement("th");
        rowHeader.textContent = row.index;
        tr.appendChild(rowHeader);

        let colIndex = 0;
        for (let key in row) {
            if (key !== "index") {
                const cell = document.createElement("td");
                const input = document.createElement("input");

                if (typeof row[key] === "boolean") {
                    input.type = "checkbox";
                    input.checked = row[key];
                } else {
                    input.type = "text";
                    input.value = row[key];
                }

                input.readOnly = true;
                cell.dataset.row = rowIndex;
                cell.dataset.col = colIndex;
                cell.appendChild(input);
                tr.appendChild(cell);

                colIndex++;
            }
        }
        tbody.appendChild(tr);
    });
}
