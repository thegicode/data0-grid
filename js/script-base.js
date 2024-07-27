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
    "방울 토마토",
    "양파",
    "호박",
    "오이",
];
let selectedCell = null;
let isComposing = false;
let popoverIndex = -1;

function createGrid(rows, cols) {
    for (let i = 0; i < rows; i++) {
        const row = document.createElement("tr");
        const rowHeader = document.createElement("th");
        rowHeader.textContent = i + 1;
        row.appendChild(rowHeader);

        for (let j = 0; j < cols; j++) {
            const cell = document.createElement("td");

            if (i === 1 && j === 1) {
                // 특정 셀에 체크박스를 추가
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
                input.readOnly = true; // 기본적으로 비활성화
                cell.appendChild(input);
            }

            row.appendChild(cell);
        }
        tbody.appendChild(row);
    }
}

function createPopover() {
    const popover = document.createElement("div");
    popover.id = "popover";
    popover.className = "popover";
    popover.style.display = "none";
    document.body.appendChild(popover);
}

function showPopover(input, matches) {
    const popover = document.getElementById("popover");
    if (matches.length === 0) {
        popover.style.display = "none";
        return;
    }

    popover.innerHTML = matches
        .map((item) => `<div class="popover-item">${item}</div>`)
        .join("");
    const rect = input.getBoundingClientRect();
    popover.style.top = `${rect.bottom + window.scrollY}px`;
    popover.style.left = `${rect.left + window.scrollX}px`;
    popover.style.width = `${rect.width}px`;
    popover.style.display = "block";

    const popoverItems = popover.querySelectorAll(".popover-item");
    popoverItems.forEach((item, index) => {
        item.addEventListener("click", () => {
            input.value = item.textContent;
            hidePopover();
            input.focus();
        });
    });
    popoverIndex = -1;
}

function hidePopover() {
    const popover = document.getElementById("popover");
    popover.style.display = "none";
    popoverIndex = -1;
}

function highlightPopoverItem(index) {
    const popover = document.getElementById("popover");
    const items = popover.querySelectorAll(".popover-item");
    items.forEach((item, i) => {
        item.classList.toggle("selected", i === index);
    });
}

function selectCell(cell) {
    if (selectedCell) {
        selectedCell.classList.remove("selected");
        const selectedInput = selectedCell.querySelector("input[type='text']");
        if (selectedInput) selectedInput.readOnly = true; // 선택 해제 시 비활성화
        hidePopover(); // 선택 해제 시 팝오버 숨기기
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
        const input = cell.querySelector("input[type='text']");
        if (input) {
            input.readOnly = false;
            input.focus();
        }
    }
});

grid.addEventListener("input", (e) => {
    if (e.target.tagName === "INPUT" && e.target.type === "text") {
        const { row, col } = e.target.dataset;
        console.log(`셀 (${row}, ${col}) 값 변경: ${e.target.value}`);
        e.target.readOnly = false; // 입력 시 편집 모드 활성화

        // 입력한 텍스트와 일치하는 식자재 찾기
        const matches = ingredients.filter((item) =>
            item.includes(e.target.value)
        );
        showPopover(e.target, matches);
    }
});

grid.addEventListener("compositionstart", (e) => {
    isComposing = true;
});

grid.addEventListener("compositionend", (e) => {
    isComposing = false;
});

document.addEventListener("keydown", (e) => {
    if (!selectedCell) return;

    const input = selectedCell.querySelector("input");
    const checkbox = selectedCell.querySelector("input[type='checkbox']");
    const currentRow = parseInt(input?.dataset.row || checkbox?.dataset.row);
    const currentCol = parseInt(input?.dataset.col || checkbox?.dataset.col);
    const isEditing = document.activeElement === input;
    const popover = document.getElementById("popover");
    const items = popover.querySelectorAll(".popover-item");
    const isPrintableKey = (e) => {
        const key = e.key;
        const isPrintable =
            /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~` ]$/.test(key);
        return isPrintable && !e.ctrlKey && !e.altKey && !e.metaKey;
    };

    if (
        popover.style.display === "block" &&
        (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter")
    ) {
        e.preventDefault();
        if (e.key === "ArrowDown") {
            popoverIndex = (popoverIndex + 1) % items.length;
        } else if (e.key === "ArrowUp") {
            popoverIndex = (popoverIndex - 1 + items.length) % items.length;
        } else if (e.key === "Enter") {
            if (popoverIndex >= 0) {
                items[popoverIndex].click();
            } else {
                hidePopover();
            }
            return;
        }
        highlightPopoverItem(popoverIndex);
        return;
    }

    if (checkbox && e.key === " ") {
        e.preventDefault();
        checkbox.checked = !checkbox.checked;
        return;
    }

    if (isPrintableKey(e)) {
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
                hidePopover();
                if (e.shiftKey) {
                    moveTo(currentRow - 1, currentCol);
                } else {
                    moveTo(currentRow + 1, currentCol);
                }
                break;
            case "Escape":
                e.preventDefault();
                if (input) {
                    input.blur();
                }
                hidePopover();
                break;
            case "Tab":
                e.preventDefault();
                hidePopover();
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
                    input.readOnly = false; // 엔터 키로 편집 모드 활성화
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
        `td:has(input[data-row="${row}"][data-col="${col}"]), 
         td:has(input[type='checkbox'][data-row="${row}"][data-col="${col}"])`
    );
    console.log("nextCell", nextCell);
    if (nextCell) {
        selectCell(nextCell);
    }
}

createGrid(10, 3);
createPopover();
selectCell(tbody.querySelector("td")); // 초기 선택
