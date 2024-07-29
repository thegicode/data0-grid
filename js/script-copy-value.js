const grid = document.getElementById("dataGrid");
const tbody = grid.querySelector("tbody");
const ingredients = [
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
let selectedCells = new Set();
let currentSelectionRange = [];
let clipboardData = [];
let isComposing = false;
let isDragging = false; // 드래그 상태를 저장할 변수
let startCell = null;

function createGrid(rows, cols) {
    for (let i = 0; i < rows; i++) {
        const row = document.createElement("tr");
        const rowHeader = document.createElement("th");
        rowHeader.textContent = i + 1;
        row.appendChild(rowHeader);

        for (let j = 0; j < cols; j++) {
            const cell = document.createElement("td");
            cell.dataset.row = i;
            cell.dataset.col = j;

            let content = document.createElement("input");

            switch (j) {
                // case 0:
                //     content.type = "text";
                //     content.value = `${i}${j}`;
                //     break;
                case 1:
                    content.type = "number";
                    content.value = i + j;
                    break;
                case 2:
                    content.type = "text";
                    content.setAttribute("list", "ingredientList");
                    content.value = ingredients[i];
                    break;
                case 3:
                    content = document.createElement("select");
                    content.name = "select-list";
                    ingredients
                        .map((name, index) => {
                            const option = document.createElement("option");
                            option.value = name;
                            option.textContent = name;
                            if (i === index) option.selected = true;
                            return option;
                        })
                        .forEach((el) => {
                            content.appendChild(el);
                        });
                    content.ariaReadOnly = true;
                    break;
                case 4:
                    content.type = "checkbox";
                    if (i % 2 === 0) content.checked = true;
                    content.ariaReadOnly = true;
                    break;
                default:
                    content.type = "text";
                    content.value = `s-${i}${j}`;
                    break;
            }

            // 기본적으로 비활성화
            if (!content.hasAttribute("aria-readonly")) {
                content.readOnly = true;
            }

            cell.appendChild(content);
            row.appendChild(cell);
        }
        tbody.appendChild(row);
    }
}

function createDatalist() {
    const datalist = document.createElement("datalist");
    datalist.id = "ingredientList";
    ingredients.forEach((item) => {
        const option = document.createElement("option");
        option.value = item;
        datalist.appendChild(option);
    });
    document.body.appendChild(datalist);
}

function selectCell(cell, add = false) {
    if (!add) {
        selectedCells.forEach((selectedCell) => {
            selectedCell.classList.remove("selected");
            const inputElement =
                selectedCell.querySelector("input") ||
                selectedCell.querySelector("select");
            if (inputElement.ariaReadOnly === "false") {
                inputElement.ariaReadOnly = "true";
            } else {
                inputElement.readOnly = true;
            }
        });
        selectedCells.clear();
    }

    selectedCells.add(cell);
    cell.classList.add("selected");
}

function selectRange(dragStartCell, endCell) {
    const startRow = parseInt(dragStartCell.dataset.row);
    const startCol = parseInt(dragStartCell.dataset.col);
    const endRow = parseInt(endCell.dataset.row);
    const endCol = parseInt(endCell.dataset.col);

    const minRow = Math.min(startRow, endRow);
    const maxRow = Math.max(startRow, endRow);
    const minCol = Math.min(startCol, endCol);
    const maxCol = Math.max(startCol, endCol);

    let result = [];
    for (let row = minRow; row <= maxRow; row++) {
        let rows = [];
        for (let col = minCol; col <= maxCol; col++) {
            const cell = tbody.querySelector(
                `td[data-row="${row}"][data-col="${col}"]`
            );
            if (cell) selectCell(cell, true);
            // rows.push(cell.cloneNode(true));
            rows.push(cell);
        }
        result.push(rows);
    }
    currentSelectionRange = result;
}

function copyCells() {
    console.log(currentSelectionRange);
    clipboardData = currentSelectionRange.map((row) =>
        row.map((cell) => {
            const inputElement =
                cell.querySelector("input") || cell.querySelector("select");
            return inputElement.value;
            // let cellHTML = cell.outerHTML;
            // if (input) {
            //     if (input.type === "checkbox") {
            //         // 수동으로 checkbox의 상태 포함
            //         cellHTML = cellHTML.replace(
            //             /<input /,
            //             `<input ${input.checked ? 'checked="checked"' : ""} `
            //         );
            //     } else {
            //         // 수동으로 input의 value 포함
            //         cellHTML = cellHTML.replace(
            //             /<input /,
            //             `<input value="${input.value}" `
            //         );
            //     }
            // }
            // return cellHTML;
        })
    );
    const clipboardText = clipboardData.map((row) => row.join("\t")).join("\n");
    navigator.clipboard.writeText(clipboardText).then(() => {
        console.log("Data copied to clipboard");
    });
}

function pasteCells() {
    navigator.clipboard
        .readText()
        .then((text) => {
            const firstSelectedCell = Array.from(selectedCells)[0];
            let targetRow = parseInt(firstSelectedCell.dataset.row);
            let targetCol = parseInt(firstSelectedCell.dataset.col);

            const data = text.split("\n").map((row) => row.split("\t"));
            data.forEach((row, rowIndex) => {
                row.forEach((value, colIndex) => {
                    const targetCellSelector = `td[data-row="${
                        targetRow + rowIndex
                    }"][data-col="${targetCol + colIndex}"]`;
                    let targetCell = tbody.querySelector(targetCellSelector);
                    if (!targetCell) return;

                    const input =
                        targetCell.querySelector("input") ||
                        targetCell.querySelector("select");
                    if (!input) return;

                    switch (input.type) {
                        case "checkbox":
                            input.checked = Boolean(value);
                        case "number":
                            input.value = parseInt(value);
                            break;
                        default:
                            input.value = value;
                    }

                    selectedCells.add(targetCell);
                    targetCell.classList.add("selected");
                });
            });
        })
        .catch((err) => {
            console.error("Failed to read clipboard contents: ", err);
        });
}

function moveTo(row, col) {
    const nextCell = tbody.querySelector(
        `td[data-row="${row}"][data-col="${col}"]`
    );
    if (nextCell) {
        selectCell(nextCell);
    }
}

grid.addEventListener("click", (e) => {
    const cell = e.target.closest("td");

    if (cell) {
        if (e.shiftKey && selectedCells.size > 0) {
            selectRange(Array.from(selectedCells)[0], cell);
        } else {
            selectCell(cell, e.shiftKey);
        }
    }
});

grid.addEventListener("dblclick", (e) => {
    const cell = e.target.closest("td");
    if (cell) {
        const input =
            cell.querySelector("input") || cell.querySelector("select");
        if (input) {
            if (input.ariaReadOnly === "true") {
                input.ariaReadOnly = "false";
            } else {
                input.readOnly = false;
            }
            input.focus();
        }
    }
});

grid.addEventListener("compositionstart", () => {
    isComposing = true;
});

grid.addEventListener("compositionend", (e) => {
    isComposing = false;
});

grid.addEventListener("focusin", (e) => {
    if (
        e.target.tagName === "INPUT" &&
        e.target.type === "text" &&
        e.target.value.trim().length > 0
    ) {
        // e.target.setAttribute("list", "ingredientList");
    } else {
        // e.target.removeAttribute("list");
    }
});

grid.addEventListener("focusout", (e) => {
    if (e.target.tagName === "INPUT" && e.target.type === "text") {
        setTimeout(() => {
            // e.target.removeAttribute("list");
        }, 100); // Timeout to allow datalist to work on blur
    }
});

grid.addEventListener("input", (e) => {
    if (
        e.target.tagName === "INPUT" &&
        e.target.type === "text" &&
        !isComposing
    ) {
        const { row, col } = e.target.closest("td").dataset;
        console.log(`셀 (${row}, ${col}) 값 변경: ${e.target.value}`);
        e.target.readOnly = false;
    }

    if (e.target.value.trim().length > 0) {
        // e.target.setAttribute("list", "ingredientList");
    }
});

document.addEventListener("keydown", (e) => {
    if (!selectedCells.size) return;

    const firstSelectedCell = Array.from(selectedCells)[0];
    const input =
        firstSelectedCell.querySelector("input") ||
        firstSelectedCell.querySelector("select");
    const checkbox = firstSelectedCell.querySelector("input[type='checkbox']");
    const currentRow = parseInt(firstSelectedCell.dataset.row);
    const currentCol = parseInt(firstSelectedCell.dataset.col);
    const isEditing =
        input.readOnly === false || input.ariaReadOnly === "false";

    // checkbox spacebar
    if (checkbox && e.key === " ") {
        e.preventDefault();
        checkbox.checked = !checkbox.checked;
        return;
    }

    if (isEditing && !isComposing) {
        switch (e.key) {
            case "Enter":
                e.preventDefault();
                if (e.shiftKey) {
                    moveTo(currentRow - 1, currentCol);
                } else {
                    moveTo(currentRow + 1, currentCol);
                }
                const nextCell = Array.from(selectedCells)[0];
                const nextInput =
                    nextCell.querySelector("input") ||
                    nextCell.querySelector("select");
                if (nextInput.ariaReadOnly === "true") {
                    nextInput.ariaReadOnly = "false";
                } else {
                    nextInput.readOnly = false;
                }
                nextInput.focus();
                break;
            case "Escape":
                e.preventDefault();
                input.blur();
                if (input.ariaReadOnly === "false") {
                    input.ariaReadOnly = "true";
                } else {
                    input.readOnly = true;
                }
                break;
            case "Tab":
                e.preventDefault();
                input.blur();
                if (input.ariaReadOnly === "false") {
                    input.ariaReadOnly = "true";
                } else {
                    input.readOnly = true;
                }
                if (e.shiftKey) {
                    moveTo(currentRow, currentCol - 1);
                } else {
                    moveTo(currentRow, currentCol + 1);
                }
                break;
        }
    } else if (!isEditing) {
        switch (e.key) {
            case "ArrowUp":
                e.preventDefault();
                moveTo(currentRow - 1, currentCol);
                break;
            case "ArrowDown":
                e.preventDefault();
                moveTo(currentRow + 1, currentCol);
                break;
            case "ArrowLeft":
                e.preventDefault();
                moveTo(currentRow, currentCol - 1);
                break;
            case "ArrowRight":
                e.preventDefault();
                moveTo(currentRow, currentCol + 1);
                break;
            case "Enter":
                e.preventDefault();
                if (!input) return;

                if (input.ariaReadOnly === "true") {
                    input.ariaReadOnly = "false";
                } else {
                    input.readOnly = false;
                }
                input.focus();
                break;
            case "Tab":
                e.preventDefault();
                if (e.shiftKey) {
                    moveTo(currentRow, currentCol - 1);
                } else {
                    moveTo(currentRow, currentCol + 1);
                }
                break;
        }
    }
});

grid.addEventListener("mousedown", (e) => {
    const cell = e.target.closest("td");
    if (cell) {
        isDragging = true;
        startCell = cell;
        selectCell(cell, e.shiftKey);
    }
});

grid.addEventListener("mousemove", (e) => {
    if (isDragging) {
        const cell = e.target.closest("td");
        if (cell && startCell !== cell) {
            selectRange(startCell, cell);
        }
    }
});

grid.addEventListener("mouseup", () => {
    if (isDragging) {
        isDragging = false;
    }
});

grid.addEventListener("dragstart", (e) => {
    const cell = e.target.closest("td");
    if (cell && selectedCells.has(cell)) {
        // handle drag start
    } else {
        e.preventDefault();
    }
});

grid.addEventListener("dragover", (e) => {
    e.preventDefault();
});

grid.addEventListener("drop", (e) => {
    e.preventDefault();
    const cell = e.target.closest("td");
    if (cell) {
        pasteCells();
    }
});

document.addEventListener("copy", (e) => {
    copyCells();
    e.preventDefault();
});

document.addEventListener("paste", (e) => {
    pasteCells();
    e.preventDefault();
});

createGrid(10, 10);
createDatalist();
selectCell(tbody.querySelector("td")); // 초기 선택
