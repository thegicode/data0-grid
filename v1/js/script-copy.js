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
let selectedCells = new Set(); // 현재 선택된 모든 셀을 관리하며, 단일 셀 및 다중 셀 선택을 처리
let currentSelectionRange = [];
let clipboardData = [];
let isComposing = false;
let isDragging = false; // 드래그 상태를 저장할 변수
let dragStartCell = null; // 드래그로 셀 범위를 선택할 때, 드래그가 시작된 첫 번째 셀을 추적하는 역할
// let isDatalistVisible = false;

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

            const input = document.createElement("input");

            if (i === 1 && j === 1) {
                // 특정 셀에 체크박스를 추가
                input.type = "checkbox";
            } else {
                // 테스트 value
                input.type = "text";
                input.setAttribute("list", "ingredientList");
                if (i < 3 && j < 3) {
                    input.value = `${i} ${j}`;
                }
            }

            input.readOnly = true; // 기본적으로 비활성화

            cell.appendChild(input);
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
            const selectedInput = selectedCell.querySelector("input");
            if (selectedInput) selectedInput.readOnly = true;
        });
        selectedCells.clear();
    }
    selectedCells.add(cell);
    cell.classList.add("multiple-selected");
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
                `td[data-row="${row}"][data-col="${col}"]:has(input)`
            );
            if (cell) selectCell(cell, true);
            rows.push(cell.cloneNode(true));
        }
        result.push(rows);
    }
    currentSelectionRange = result;
}

function copyCells() {
    clipboardData = [...currentSelectionRange];
}

function pasteCells(clipboardText) {
    const firstSelectedCell = Array.from(selectedCells)[0];
    let targetRow = parseInt(firstSelectedCell.dataset.row);
    let targetCol = parseInt(firstSelectedCell.dataset.col);

    clipboardData.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            const targetCell = tbody.querySelector(
                `td[data-row="${targetRow + rowIndex}"][data-col="${
                    targetCol + colIndex
                }"]`
            );
            if (targetCell) {
                targetCell.innerHTML = "";
                targetCell.appendChild(
                    cell.querySelector("input").cloneNode(true)
                );
                selectedCells.add(targetCell);
                targetCell.classList.add("multiple-selected");
            }
        });
    });
}

document.addEventListener("copy", (e) => {
    copyCells();
    e.clipboardData.setData("text/plain", "copied");
    e.preventDefault();
});

document.addEventListener("paste", (e) => {
    pasteCells();
    e.preventDefault();
});

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
    // input.setAttribute("list", "ingredientList"); // datalist 연결
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
        // isDatalistVisible = true; // datalist가 표시됨
    }

    if (e.target.value.trim().length > 0) {
        // e.target.setAttribute("list", "ingredientList");
    }
});

document.addEventListener("keydown", (e) => {
    if (!selectedCells.size) return;

    const firstSelectedCell = Array.from(selectedCells)[0];
    const input = firstSelectedCell.querySelector("input");
    const checkbox = firstSelectedCell.querySelector("input[type='checkbox']");
    const currentRow = parseInt(firstSelectedCell.dataset.row);
    const currentCol = parseInt(firstSelectedCell.dataset.col);
    const isEditing =
        document.activeElement === input && input.readOnly === false;

    if (checkbox && e.key === " ") {
        e.preventDefault();
        checkbox.checked = !checkbox.checked;
        return;
    }

    if (isEditing && !isComposing) {
        switch (e.key) {
            case "Enter":
                e.preventDefault();
                // if (input) {
                //     input.removeAttribute("list"); // datalist 숨기기
                // }
                if (e.shiftKey) {
                    moveTo(currentRow - 1, currentCol);
                } else {
                    moveTo(currentRow + 1, currentCol);
                }
                const nextCell = Array.from(selectedCells)[0];
                const nextInput = nextCell.querySelector("input");
                nextInput.readOnly = false;
                nextInput.focus();
                // nextInput.setAttribute("list", "ingredientList");
                break;
            case "Escape":
                e.preventDefault();
                input.blur();
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
                if (input) {
                    input.readOnly = false;
                    input.focus();
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
        `td[data-row="${row}"][data-col="${col}"]`
    );
    if (nextCell) {
        selectCell(nextCell);
    }
}

grid.addEventListener("mousedown", (e) => {
    const cell = e.target.closest("td");
    if (cell) {
        isDragging = true;
        dragStartCell = cell;
        selectCell(cell, e.shiftKey);
    }
});

grid.addEventListener("mousemove", (e) => {
    if (isDragging) {
        const cell = e.target.closest("td");
        if (cell) {
            selectRange(dragStartCell, cell);
        }
    }
});

grid.addEventListener("mouseup", () => {
    if (isDragging) {
        isDragging = false;
        // dragData = copyCells();
    }
});

grid.addEventListener("dragstart", (e) => {
    const cell = e.target.closest("td");
    if (cell && selectedCells.has(cell)) {
        // e.dataTransfer.setData("text/plain", dragData);
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
        // const clipboardText = e.dataTransfer.getData("text/plain");
        // pasteCells(clipboardText);
    }
});

createGrid(10, 3);
createDatalist();
selectCell(tbody.querySelector("td")); // 초기 선택
