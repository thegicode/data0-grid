export function selectColumn(col) {
    const cells = tbody.querySelectorAll(`td[data-col="${col}"]`);
    cells.forEach((cell) => selectCell(cell, true));

    // Add class to the selected th
    const th = grid.querySelector(`thead th:nth-child(${col + 2})`); // +2 to account for row header and 0-index
    if (th) {
        th.classList.add("selected-th");
    }
}

export function moveColumn(from, to) {
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
