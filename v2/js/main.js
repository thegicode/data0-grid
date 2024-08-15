// main.js

import { ingredients, createGrid, renderTable } from "./grid.js";
import { selectCell, selectRange } from "./selection.js";
import { copyCells, pasteCells } from "./clipboard.js";
import { createDatalist } from "./datalist.js";

document.addEventListener("DOMContentLoaded", () => {
    const gridElement = document.getElementById("dataGrid");
    const tbody = gridElement.querySelector("tbody");

    createGrid(tbody, 10, 10);
    createDatalist(ingredients);

    gridElement.addEventListener("click", (e) => {
        const cell = e.target.closest("td");
        if (cell) {
            selectCell(cell);
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
});
