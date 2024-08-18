const grid = document.getElementById("dataGrid");
const tbody = grid.querySelector("tbody");
// const ingredients = [
//     "사과",
//     "바나나",
//     "당근",
//     "다시마",
//     "계란",
//     "감자",
//     "토마토",
//     "양파",
//     "호박",
//     "오이",
// ];
// let selectedCells = new Set();
// let currentSelectionRange = [];
// let clipboardData = [];
// let isComposing = false;
// let isDragging = false; // 드래그 상태를 저장할 변수
let startCell = null;
// let draggingColumn = null;
// let originalValue = ""; // 원래의 값을 저장할 변수
// let originalData = [];
// let currentSortOrder = "none";
// let lastSortedColumn = null;
// let isSelecting = false;
// let selectionStart = null;
let selectionEnd = null;
// const csvButton = document.querySelector(".csv-button");

/* function createGrid(rows, cols) {
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
 */

// function createDatalist() {
//     const datalist = document.createElement("datalist");
//     datalist.id = "ingredientList";
//     ingredients.forEach((item) => {
//         const option = document.createElement("option");
//         option.value = item;
//         datalist.appendChild(option);
//     });
//     document.body.appendChild(datalist);
// }

/* function renderTable(data) {
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
} */
/* 
function sortTable(columnIndex, order) {
    let data = [...originalData];
    if (order === "ascending") {
        data.sort((a, b) => {
            if (a["col" + columnIndex] < b["col" + columnIndex]) return -1;
            if (a["col" + columnIndex] > b["col" + columnIndex]) return 1;
            return 0;
        });
    } else if (order === "descending") {
        data.sort((a, b) => {
            if (a["col" + columnIndex] < b["col" + columnIndex]) return 1;
            if (a["col" + columnIndex] > b["col" + columnIndex]) return -1;
            return 0;
        });
    }
    renderTable(data);
} */

/* function selectCell(cell, add = false) {
    if (!add) {
        selectedCells.forEach((selectedCell) => {
            selectedCell.classList.remove("selected");
            const input =
                selectedCell.querySelector("input") ||
                selectedCell.querySelector("select");
        });
        selectedCells.clear();
    }

    selectedCells.add(cell);
    cell.classList.add("selected");
} */

/* function selectRange(dragStartCell, endCell) {
    const startRow = parseInt(dragStartCell.dataset.row);
    const startCol = parseInt(dragStartCell.dataset.col);
    const endRow = parseInt(endCell.dataset.row);
    const endCol = parseInt(endCell.dataset.col);

    const minRow = Math.min(startRow, endRow);
    const maxRow = Math.max(startRow, endRow);
    const minCol = Math.min(startCol, endCol);
    const maxCol = Math.max(startCol, endCol);

    // Clear previous selection
    selectedCells.forEach((cell) => {
        cell.classList.remove("selected");
    });
    selectedCells.clear();

    let result = [];
    for (let row = minRow; row <= maxRow; row++) {
        let rows = [];
        for (let col = minCol; col <= maxCol; col++) {
            const cell = tbody.querySelector(
                `td[data-row="${row}"][data-col="${col}"]`
            );
            if (cell) selectCell(cell, true);
            rows.push(cell);
        }
        result.push(rows);
    }
    currentSelectionRange = result;

    if (selectedCells.size > 1) csvButton.hidden = false;
} */

/* function copyCells() {
    const getInputValue = (cell) => {
        const inputElement =
            cell.querySelector("input") || cell.querySelector("select");
        if (inputElement.type === "checkbox") {
            result = inputElement.checked;
        } else {
            result = inputElement.value;
        }

        return result;
    };

    let clipboardText;
    if (selectedCells.size === 1) {
        const cell = [...selectedCells][0];
        clipboardText = getInputValue(cell);
    } else {
        clipboardData = currentSelectionRange.map((row) =>
            row.map((cell) => getInputValue(cell))
        );
        clipboardText = clipboardData.map((row) => row.join("\t")).join("\n");
    }

    navigator.clipboard.writeText(clipboardText).then(() => {
        console.log("Data copied to clipboard");
    });
} */

/* function pasteCells() {
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
                        case "number":
                            if (parseInt(value)) input.value = parseInt(value);
                            break;
                        case "checkbox":
                            if (value === "true" || value === "false")
                                input.checked = Boolean(value === "true");
                            break;
                        case "select-one":
                            if (ingredients.includes(value))
                                input.value = value;
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
 */

/* function moveTo(row, col) {
    const nextCell = tbody.querySelector(
        `td[data-row="${row}"][data-col="${col}"]`
    );
    if (nextCell) {
        selectCell(nextCell);
        nextCell.scrollIntoView({
            behavior: "smooth",
            block: "center", // 수직 정렬을 지정
            inline: "end", // 수평 정렬을 지정
        });
    }
} */
/* 
function selectColumn(col) {
    const cells = tbody.querySelectorAll(`td[data-col="${col}"]`);
    cells.forEach((cell) => selectCell(cell, true));

    // Add class to the selected th
    const th = grid.querySelector(`thead th:nth-child(${col + 2})`); // +2 to account for row header and 0-index
    if (th) {
        th.classList.add("selected-th");
    }
}

function moveColumn(from, to) {
    const rows = tbody.querySelectorAll("tr");
    rows.forEach((row) => {
        const cells = Array.from(row.children);
        const fromCell = cells[from + 1]; // +1 to account for row header
        const toCell = cells[to + 1];
        row.insertBefore(fromCell, to < from ? toCell : toCell.nextSibling);
        fromCell.dataset.col = to;
        toCell.dataset.col = from;
    });

    // Move column header
    const headers = grid.querySelectorAll("thead th");
    const fromHeader = headers[from + 1];
    const toHeader = headers[to + 1];
    grid.querySelector("thead tr").insertBefore(
        fromHeader,
        to < from ? toHeader : toHeader.nextSibling
    );
}
 */

/* // 검색 기능 추가
function highlightSearchResults(searchText) {
    clearHighlights();

    const cells = tbody.querySelectorAll("td");
    cells.forEach((cell) => {
        const input =
            cell.querySelector("input") || cell.querySelector("select");
        if (input && input.value.includes(searchText)) {
            cell.classList.add("highlight");
        }
    });
} */

/* function clearHighlights() {
    const highlightedCells = tbody.querySelectorAll(".highlight");
    highlightedCells.forEach((cell) => {
        cell.classList.remove("highlight");
    });
} */

/* grid.addEventListener("click", (e) => {
    clearHighlights();

    const cell = e.target.closest("td");

    if (cell) {
        // Clear previous selection including th
        const ths = grid.querySelectorAll("thead th");
        ths.forEach((th) => th.classList.remove("selected-th"));

        csvButton.hidden = true;

        if (e.shiftKey && selectedCells.size > 0) {
            selectRange(Array.from(selectedCells)[0], cell);
        } else {
            selectCell(cell, e.shiftKey);
        }
    }
}); */

/* grid.addEventListener("dblclick", (e) => {
    const cell = e.target.closest("td");
    if (cell) {
        const input =
            cell.querySelector("input") || cell.querySelector("select");
        if (input) {
            // if (input.ariaReadOnly === "true") {
            //     input.ariaReadOnly = "false";
            // } else {
            input.readOnly = false;
            // }
            input.focus();
        }
    }
}); */

/* grid.addEventListener("compositionstart", () => {
    isComposing = true;
});

grid.addEventListener("compositionend", (e) => {
    isComposing = false;
}); */

/* grid.addEventListener("focusin", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT") {
        // 포커스가 인풋이나 셀렉트로 들어오면 원래 값을 저장
        originalValue = e.target.value;
    }
});

grid.addEventListener("focusout", (e) => {
    if (e.target.tagName === "INPUT" && e.target.type === "text") {
        setTimeout(() => {
            // e.target.removeAttribute("list");
        }, 100); // Timeout to allow datalist to work on blur
    }
});
 */
/* grid.addEventListener("input", (e) => {
    if (
        e.target.tagName === "INPUT" &&
        e.target.type === "text" &&
        !isComposing
    ) {
        const { row, col } = e.target.closest("td").dataset;
        console.log(`셀 (${row}, ${col}) 값 변경: ${e.target.value}`);
        e.target.readOnly = false;
    }

    // if (e.target.value.trim().length > 0) {
    // e.target.setAttribute("list", "ingredientList");
    // }
});
 */

/* document.addEventListener("keydown", (e) => {
    if (!selectedCells.size) return;

    const firstSelectedCell = Array.from(selectedCells)[0];
    const input =
        firstSelectedCell.querySelector("input") ||
        firstSelectedCell.querySelector("select");
    const currentRow = parseInt(firstSelectedCell.dataset.row);
    const currentCol = parseInt(firstSelectedCell.dataset.col);
    let isEditing = input.hasAttribute("aria-readonly")
        ? input.ariaReadOnly === "false"
        : input.readOnly === false;

    if (input && e.key === " ") {
        if (input.type === "checkbox") {
            e.preventDefault();
            input.focus();
            input.checked = !input.checked;
            return;
        } else if (input.tagName === "SELECT") {
            input.focus();
            // input.ariaReadOnly = "false";
            return;
        }
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
                input.value = originalValue;
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
    } else {
        switch (e.key) {
            case "ArrowUp":
                e.preventDefault();
                moveTo(currentRow - 1, currentCol);
                if (input.type === "checkbox") input.blur();
                break;
            case "ArrowDown":
                e.preventDefault();
                moveTo(currentRow + 1, currentCol);
                if (input.type === "checkbox") input.blur();
                break;
            case "ArrowLeft":
                e.preventDefault();
                moveTo(currentRow, currentCol - 1);
                if (input.type === "checkbox") input.blur();
                break;
            case "ArrowRight":
                e.preventDefault();
                moveTo(currentRow, currentCol + 1);
                if (input.type === "checkbox") input.blur();
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

    // cmd + f 또는 ctrl + f 로 검색을 활성화하는 부분 추가
    if (e.key === "f" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        const searchText = prompt("Enter text to search:");
        if (searchText) {
            highlightSearchResults(searchText);
        }
    }
}); */

// Add change event listener for all select elements
/* tbody.addEventListener("change", (e) => {
    if (e.target.tagName === "SELECT") {
        const currentCell = e.target.closest("td");
        const currentRow = parseInt(currentCell.dataset.row);
        const currentCol = parseInt(currentCell.dataset.col);

        currentCell.ariaReadOnly = "true";

        // Move to the next select element
        moveTo(currentRow + 1, currentCol);
        const nextCell = tbody.querySelector(
            `td[data-row="${currentRow + 1}"][data-col="${currentCol}"]`
        );
        if (nextCell) {
            const nextSelect = nextCell.querySelector("select");
            if (nextSelect) {
                nextSelect.focus();
            }
        }
    }
}); */

/* function clearSelection() {
    const selctedTh = grid.querySelector(".selected-th");
    if (selctedTh) {
        selctedTh.classList.remove("selected-th");
    }

    selectedCells.forEach((selectedCell) => {
        selectedCell.classList.remove("selected");
    });

    selectedCells.clear();
} */
/* 
grid.querySelector("thead").addEventListener("mousedown", (e) => {
    const th = e.target.closest("th");
    if (th) {
        clearSelection();
        const colIndex = Array.from(th.parentNode.children).indexOf(th) - 1; // -1 to account for row header
        if (colIndex >= 0) {
            isDragging = true;
            draggingColumn = colIndex;
            selectColumn(colIndex);
            th.classList.add("dragging");
        }
    }
});
 */
// sort-button 클릭 이벤트는 th 안의 버튼에 적용됩니다.
/* grid.querySelector("thead").addEventListener("click", (e) => {
    if (e.target.classList.contains("sort-button")) {
        // sort-button 클릭 시 이벤트 핸들러입니다.
        const th = e.target.closest("th");
        const colIndex = Array.from(th.parentNode.children).indexOf(th) - 1; // -1 to account for row header
        const button = e.target;

        if (lastSortedColumn !== colIndex) {
            currentSortOrder = "none";
        }

        if (currentSortOrder === "none") {
            currentSortOrder = "ascending";
        } else if (currentSortOrder === "ascending") {
            currentSortOrder = "descending";
        } else {
            currentSortOrder = "none";
        }

        button.dataset.sort = currentSortOrder;

        if (currentSortOrder === "none") {
            renderTable(originalData);
        } else {
            sortTable(colIndex, currentSortOrder);
        }

        lastSortedColumn = colIndex;
    }
}); */

/* grid.querySelector("thead").addEventListener("mouseup", (e) => {
    const th = e.target.closest("th");
    if (isDragging && draggingColumn !== null) {
        isDragging = false;
        draggingColumn = null;
        if (th) {
            th.classList.remove("dragging");
        }
    }
}); */

/* grid.querySelector("thead").addEventListener("mousemove", (e) => {
    if (isDragging && draggingColumn !== null) {
        const th = e.target.closest("th");
        if (th) {
            const colIndex = Array.from(th.parentNode.children).indexOf(th) - 1; // -1 to account for row header
            if (colIndex >= 0 && colIndex !== draggingColumn) {
                moveColumn(draggingColumn, colIndex);
                draggingColumn = colIndex;
            }
        }
    }
});
 */
/* grid.addEventListener("mousedown", (e) => {
    const cell = e.target.closest("td");

    if (e.shiftKey) return;

    if (cell) {
        isSelecting = true;
        selectionStart = cell;
        clearSelection();
        selectCell(cell);
    }
});
 */
/* grid.addEventListener("mousemove", (e) => {
    if (isSelecting) {
        const cell = e.target.closest("td");
        if (cell) {
            selectRange(selectionStart, cell);
        }
    }
});

grid.addEventListener("mouseup", () => {
    isSelecting = false;
}); */

/* grid.addEventListener("dragstart", (e) => {
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
}); */

/* document.addEventListener("copy", (e) => {
    copyCells();
    e.preventDefault();
});

document.addEventListener("paste", (e) => {
    pasteCells();
    e.preventDefault();
});
 */

/* csvButton.addEventListener("click", (e) => {
    const getInputValue = (cell) => {
        const inputElement =
            cell.querySelector("input") || cell.querySelector("select");
        if (inputElement.type === "checkbox") {
            return inputElement.checked ? "true" : "false";
        } else {
            return inputElement.value;
        }
    };

    // Convert selectedCells to an array and sort by row and column
    const sortedCells = [...selectedCells].sort((a, b) => {
        const aRow = parseInt(a.dataset.row);
        const aCol = parseInt(a.dataset.col);
        const bRow = parseInt(b.dataset.row);
        const bCol = parseInt(b.dataset.col);

        if (aRow === bRow) {
            return aCol - bCol;
        }
        return aRow - bRow;
    });

    // Create a 2D array to store the clipboard data and keep track of non-empty columns
    const rows = [];
    const selectedCols = new Set();
    sortedCells.forEach((cell) => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        const value = getInputValue(cell);

        if (!rows[row]) {
            rows[row] = [];
        }

        if (value !== "") {
            rows[row][col] = value;
            selectedCols.add(col);
        }
    });

    // Filter out empty rows
    const filteredRows = rows.filter(
        (row) => row !== undefined && row.some((cell) => cell !== undefined)
    );

    // Convert the 2D array to CSV text and include row header numbers
    const csvRows = filteredRows.map((row, rowIndex) =>
        [
            rowIndex + 1,
            ...Array.from(selectedCols)
                .sort((a, b) => a - b)
                .map((col) => row[col] || ""),
        ].join(",")
    );

    // Add headers to CSV text based on selected columns
    const headers = Array.from(grid.querySelectorAll("thead th .name")).map(
        (th) => th.textContent
    );
    const selectedHeaders = [
        "Row Number",
        ...Array.from(selectedCols)
            .sort((a, b) => a - b)
            .map((colIndex) => headers[colIndex]),
    ]; // +1 to account for row header

    const csvText = [selectedHeaders.join(","), ...csvRows].join("\n");

    downloadCSV(csvText, "data.csv");

    csvButton.hidden = true;
});

function downloadCSV(csv, filename) {
    const csvFile = new Blob([csv], { type: "text/csv" });
    const downloadLink = document.createElement("a");

    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);

    downloadLink.click();
    document.body.removeChild(downloadLink);
} */

// createGrid(10, 10);
// createDatalist();
// selectCell(tbody.querySelector("td")); // 초기 선택
