// main.js

import { originalData, ingredients, createGrid, renderTable } from "./grid.js";
import {
    selectedCells,
    selectCell,
    selectRange,
    clearSelection,
    clearHighlights,
    moveTo,
} from "./selection.js";
import { copyCells, pasteCells } from "./clipboard.js";
import { createDatalist } from "./datalist.js";
import { selectColumn, moveColumn } from "./column.js";
import { highlightSearchResults } from "./search.js";
import { sortTable } from "./sort.js";

document.addEventListener("DOMContentLoaded", () => {
    const gridElement = document.getElementById("dataGrid");
    const tbody = gridElement.querySelector("tbody");
    const csvButton = document.querySelector(".csv-button");

    createGrid(tbody, 10, 10);
    createDatalist(ingredients);
    selectCell(tbody.querySelector("td")); // 초기 선택

    addEvents(gridElement, tbody, csvButton);
});

function addEvents(gridElement, tbody, csvButton) {
    const theadElement = gridElement.querySelector("thead");

    let isComposing = false;
    let originalValue = ""; // 원래의 값을 저장할 변수
    let lastSortedColumn = null;
    let currentSortOrder = "none";

    /** TD Cell */
    gridElement.addEventListener("click", (e) => {
        clearHighlights(tbody);

        const cell = e.target.closest("td");

        if (cell) {
            const ths = gridElement.querySelectorAll("thead th");
            ths.forEach((th) => th.classList.remove("selected-th"));

            csvButton.hidden = true;

            if (e.shiftKey && selectedCells.size > 0) {
                selectRange(
                    tbody,
                    Array.from(selectedCells)[0],
                    cell,
                    csvButton
                );
            } else {
                selectCell(cell, e.shiftKey);
            }
        }
    });

    gridElement.addEventListener("dblclick", (e) => {
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
    });

    /** INPUT */
    gridElement.addEventListener("input", (e) => {
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

    gridElement.addEventListener("focusin", (e) => {
        if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT") {
            // 포커스가 인풋이나 셀렉트로 들어오면 원래 값을 저장
            originalValue = e.target.value;
            // escape 이벤트 확인요
        }
    });

    gridElement.addEventListener("focusout", (e) => {
        if (e.target.tagName === "INPUT" && e.target.type === "text") {
            setTimeout(() => {
                // e.target.removeAttribute("list");
            }, 100); // Timeout to allow datalist to work on blur
        }
    });

    // cell key down
    gridElement.addEventListener("keydown", (e) => {
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
                        moveTo(tbody, selectCell, currentRow - 1, currentCol);
                    } else {
                        moveTo(tbody, selectCell, currentRow + 1, currentCol);
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
                        moveTo(tbody, selectCell, currentRow, currentCol - 1);
                    } else {
                        moveTo(tbody, selectCell, currentRow, currentCol + 1);
                    }
                    break;
            }
        } else {
            switch (e.key) {
                case "ArrowUp":
                    e.preventDefault();
                    moveTo(tbody, selectCell, currentRow - 1, currentCol);
                    if (input.type === "checkbox") input.blur();
                    break;
                case "ArrowDown":
                    e.preventDefault();
                    moveTo(tbody, selectCell, currentRow + 1, currentCol);
                    if (input.type === "checkbox") input.blur();
                    break;
                case "ArrowLeft":
                    e.preventDefault();
                    moveTo(tbody, selectCell, currentRow, currentCol - 1);
                    if (input.type === "checkbox") input.blur();
                    break;
                case "ArrowRight":
                    e.preventDefault();
                    moveTo(tbody, selectCell, currentRow, currentCol + 1);
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
                        moveTo(tbody, selectCell, currentRow, currentCol - 1);
                    } else {
                        moveTo(tbody, selectCell, currentRow, currentCol + 1);
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
    });

    /** SELECT Change Event */
    gridElement.addEventListener("change", (e) => {
        if (e.target.tagName === "SELECT") {
            const currentCell = e.target.closest("td");
            const currentRow = parseInt(currentCell.dataset.row);
            const currentCol = parseInt(currentCell.dataset.col);

            currentCell.ariaReadOnly = "true";

            // Move to the next select element
            moveTo(tbody, selectCell, currentRow + 1, currentCol);
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
    });

    /** THEAD */
    // sort button(th 안의 버튼)
    theadElement.addEventListener("click", (e) => {
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
                renderTable(tbody, originalData);
            } else {
                sortTable(
                    colIndex,
                    currentSortOrder,
                    originalData,
                    renderTable,
                    tbody
                );
            }

            lastSortedColumn = colIndex;
        }
    });

    /** ETC */
    gridElement.addEventListener("compositionstart", () => {
        isComposing = true;
    });

    gridElement.addEventListener("compositionend", (e) => {
        isComposing = false;
    });
}
