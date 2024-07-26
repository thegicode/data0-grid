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
let selectedCell = null;
let isComposing = false;
let isDatalistVisible = false;

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
                input.name = "list";
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

function selectCell(cell) {
    if (selectedCell) {
        selectedCell.classList.remove("selected");
        const selectedInput = selectedCell.querySelector("input[name='list']");
        if (selectedInput) selectedInput.readOnly = true;
    }
    selectedCell = cell;
    selectedCell.classList.add("selected");
}

grid.addEventListener("click", (e) => {
    const cell = e.target.closest("td");
    if (cell) {
        selectCell(cell);
    }
});

grid.addEventListener("dblclick", (e) => {
    const cell = e.target.closest("td");
    if (cell) {
        const input = cell.querySelector("input[name='list']");
        if (input) {
            input.readOnly = false;
            input.focus();
        }
    }
});

grid.addEventListener("compositionstart", (e) => {
    isComposing = true;
});

grid.addEventListener("compositionend", (e) => {
    isComposing = false;
    const input = e.target;
    input.setAttribute("list", "ingredientList"); // datalist 연결
});

grid.addEventListener("input", (e) => {
    if (
        e.target.tagName === "INPUT" &&
        e.target.name === "list" &&
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
        if (e.target.tagName === "INPUT" && e.target.name === "list") {
            isDatalistVisible = false; // datalist가 숨겨짐
        }
    },
    true
);

document.addEventListener("keydown", (e) => {
    if (!selectedCell) return;

    const input = selectedCell.querySelector("input[name='list']");
    const checkbox = selectedCell.querySelector("input[type='checkbox']");
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

createGrid(10, 3);
createDatalist();
selectCell(tbody.querySelector("td")); // 초기 선택
