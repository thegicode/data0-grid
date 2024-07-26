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
let isComposing = false;
let isDragging = false; // 드래그 상태를 저장할 변수
let dragData = ""; // 드래그 데이터를 저장할 변수
let startCell = null;

function createGrid(rows, cols) {
    for (let i = 0; i < rows; i++) {
        const row = document.createElement("tr");
        const rowHeader = document.createElement("th");
        rowHeader.textContent = i + 1;
        row.appendChild(rowHeader);

        for (let j = 0; j < cols; j++) {
            const cell = document.createElement("td");

            if (i === 1 && j === 1) {
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.dataset.row = i;
                checkbox.dataset.col = j;
                cell.appendChild(checkbox);
            } else {
                const input = document.createElement("input");
                input.type = "text";
                input.dataset.row = i;
                input.dataset.col = j;
                input.readOnly = true;
                input.setAttribute("list", "ingredientList");
                cell.appendChild(input);
            }

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
            selectedCell.classList.remove("multiple-selected");
            const selectedInput =
                selectedCell.querySelector("input[type='text']");
            if (selectedInput) selectedInput.readOnly = true;
        });
        selectedCells.clear();
    }
    selectedCells.add(cell);
    cell.classList.add("multiple-selected");
    const input = cell.querySelector("input[type='text']");
    if (input) input.readOnly = false;
}

function selectRange(startCell, endCell) {
    const startRow = parseInt(
        startCell.querySelector("input[type='text'], input[type='checkbox']")
            .dataset.row
    );
    const startCol = parseInt(
        startCell.querySelector("input[type='text'], input[type='checkbox']")
            .dataset.col
    );
    const endRow = parseInt(
        endCell.querySelector("input[type='text'], input[type='checkbox']")
            .dataset.row
    );
    const endCol = parseInt(
        endCell.querySelector("input[type='text'], input[type='checkbox']")
            .dataset.col
    );

    const minRow = Math.min(startRow, endRow);
    const maxRow = Math.max(startRow, endRow);
    const minCol = Math.min(startCol, endCol);
    const maxCol = Math.max(startCol, endCol);

    for (let row = minRow; row <= maxRow; row++) {
        for (let col = minCol; col <= maxCol; col++) {
            const cell = tbody.querySelector(
                `td:has(input[data-row="${row}"][data-col="${col}"])`
            );
            if (cell) selectCell(cell, true);
        }
    }
}

function copyCells() {
    const clipboardData = [];
    let currentRow = -1;
    const sortedCells = Array.from(selectedCells).sort((a, b) => {
        const aRow = parseInt(
            a.querySelector("input[type='text']")?.dataset.row ||
                a.querySelector("input[type='checkbox']")?.dataset.row
        );
        const bRow = parseInt(
            b.querySelector("input[type='text']")?.dataset.row ||
                b.querySelector("input[type='checkbox']")?.dataset.row
        );
        const aCol = parseInt(
            a.querySelector("input[type='text']")?.dataset.col ||
                a.querySelector("input[type='checkbox']")?.dataset.col
        );
        const bCol = parseInt(
            b.querySelector("input[type='text']")?.dataset.col ||
                b.querySelector("input[type='checkbox']")?.dataset.col
        );
        return aRow === bRow ? aCol - bCol : aRow - bRow;
    });

    sortedCells.forEach((cell) => {
        const input = cell.querySelector("input[type='text']");
        const checkbox = cell.querySelector("input[type='checkbox']");
        const row = parseInt(input?.dataset.row || checkbox?.dataset.row);
        const col = parseInt(input?.dataset.col || checkbox?.dataset.col);
        if (row !== currentRow) {
            clipboardData.push([]);
            currentRow = row;
        }
        clipboardData[clipboardData.length - 1].push(
            input ? input.value : checkbox.checked ? "✔" : "✘"
        );
    });
    return clipboardData.map((row) => row.join("\t")).join("\n");
}

function pasteCells(clipboardText) {
    const rows = clipboardText.split("\n");
    const firstSelectedCell = Array.from(selectedCells)[0];
    const inputElement = firstSelectedCell.querySelector("input[type='text']");
    const checkboxElement = firstSelectedCell.querySelector(
        "input[type='checkbox']"
    );

    let targetRow = parseInt(
        inputElement?.dataset.row || checkboxElement?.dataset.row
    );
    let targetCol = parseInt(
        inputElement?.dataset.col || checkboxElement?.dataset.col
    );

    rows.forEach((row, rowIndex) => {
        const cells = row.split("\t");
        cells.forEach((cellData, colIndex) => {
            const targetCell = tbody.querySelector(
                `td:has(input[data-row="${targetRow + rowIndex}"][data-col="${
                    targetCol + colIndex
                }"]), 
                td:has(input[type='checkbox'][data-row="${
                    targetRow + rowIndex
                }"][data-col="${targetCol + colIndex}"])`
            );
            if (targetCell) {
                const input = targetCell.querySelector("input[type='text']");
                const checkbox = targetCell.querySelector(
                    "input[type='checkbox']"
                );
                if (input) input.value = cellData;
                if (checkbox) checkbox.checked = cellData === "✔";
            }
        });
    });
}

document.addEventListener("copy", (e) => {
    const clipboardData = copyCells();
    e.clipboardData.setData("text/plain", clipboardData);
    e.preventDefault();
});

document.addEventListener("paste", (e) => {
    const clipboardText = e.clipboardData.getData("text/plain");
    pasteCells(clipboardText);
    e.preventDefault();
});

grid.addEventListener("click", (e) => {
    const cell = e.target.closest("td");
    if (cell) {
        selectCell(cell, e.shiftKey);
    }
});

grid.addEventListener("dblclick", (e) => {
    const cell = e.target.closest("td");
    if (cell) {
        const input = cell.querySelector("input[type='text']");
        if (input) {
            input.readOnly = false;
            input.focus();
        }
    }
});

grid.addEventListener("compositionstart", () => {
    isComposing = true;
});

grid.addEventListener("compositionend", (e) => {
    isComposing = false;
    const input = e.target;
    input.setAttribute("list", "ingredientList"); // datalist 연결
});

grid.addEventListener("focusin", (e) => {
    if (
        e.target.tagName === "INPUT" &&
        e.target.type === "text" &&
        e.target.value.trim() !== ""
    ) {
        e.target.setAttribute("list", "ingredientList");
    }
});

grid.addEventListener("focusout", (e) => {
    if (e.target.tagName === "INPUT" && e.target.type === "text") {
        setTimeout(() => {
            e.target.removeAttribute("list");
        }, 100); // Timeout to allow datalist to work on blur
    }
});

grid.addEventListener("input", (e) => {
    if (
        e.target.tagName === "INPUT" &&
        e.target.type === "text" &&
        !isComposing
    ) {
        const { row, col } = e.target.dataset;
        console.log(`셀 (${row}, ${col}) 값 변경: ${e.target.value}`);
        e.target.readOnly = false;
        isDatalistVisible = true; // datalist가 표시됨
    }
});

grid.addEventListener(
    "blur",
    (e) => {
        if (e.target.tagName === "INPUT" && e.target.type === "text") {
            isDatalistVisible = false; // datalist가 숨겨짐
        }
    },
    true
);

document.addEventListener("keydown", (e) => {
    if (!selectedCells.size) return;

    const firstSelectedCell = Array.from(selectedCells)[0];
    const input = firstSelectedCell.querySelector("input[type='text']");
    const checkbox = firstSelectedCell.querySelector("input[type='checkbox']");
    const currentRow = parseInt(input?.dataset.row || checkbox?.dataset.row);
    const currentCol = parseInt(input?.dataset.col || checkbox?.dataset.col);
    const isEditing =
        document.activeElement === input || document.activeElement === checkbox;

    const isPrintableKey = (e) => {
        const key = e.key;
        const isPrintable =
            /^[a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~` ]$/.test(
                key
            );
        return isPrintable && !e.ctrlKey && !e.altKey && !e.metaKey;
    };

    if (checkbox && e.key === " ") {
        e.preventDefault();
        checkbox.checked = !checkbox.checked;
        return;
    }

    if (input && input.readOnly === true && isPrintableKey(e)) {
        if (input) {
            input.readOnly = false;
            input.focus();
        }
        return;
    }

    if (isEditing && !isComposing) {
        switch (e.key) {
            case "Enter":
                e.preventDefault();
                if (input) {
                    input.removeAttribute("list"); // datalist 숨기기
                    setTimeout(
                        () => input.setAttribute("list", "ingredientList"),
                        0
                    ); // 다음 이벤트 루프에서 다시 연결
                }
                if (e.shiftKey) {
                    moveTo(currentRow - 1, currentCol);
                } else {
                    moveTo(currentRow + 1, currentCol);
                }
                (input || checkbox).blur();
                break;
            case "Escape":
                e.preventDefault();
                (input || checkbox).blur();
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
                const inputEl = input || checkbox;
                if (inputEl) {
                    inputEl.readOnly = false;
                    inputEl.focus();
                }
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

function moveTo(row, col) {
    const nextCell = tbody.querySelector(
        `td:has(input[data-row="${row}"][data-col="${col}"]), 
        td:has(input[type='checkbox'][data-row="${row}"][data-col="${col}"])`
    );
    if (nextCell) {
        selectCell(nextCell);
    }
}

// 드래그 앤 드롭 이벤트 핸들러 추가
grid.addEventListener("mousedown", (e) => {
    const cell = e.target.closest("td");
    if (cell) {
        isDragging = true;
        startCell = cell;
        selectCell(cell, false);
    }
});

grid.addEventListener("mousemove", (e) => {
    if (isDragging) {
        const cell = e.target.closest("td");
        if (cell) {
            selectRange(startCell, cell);
        }
    }
});

grid.addEventListener("mouseup", () => {
    if (isDragging) {
        isDragging = false;
        dragData = copyCells();
    }
});

grid.addEventListener("dragstart", (e) => {
    const cell = e.target.closest("td");
    if (cell && selectedCells.has(cell)) {
        e.dataTransfer.setData("text/plain", dragData);
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
        const clipboardText = e.dataTransfer.getData("text/plain");
        pasteCells(clipboardText);
    }
});

createGrid(10, 3);
createDatalist();
selectCell(tbody.querySelector("td")); // 초기 선택
