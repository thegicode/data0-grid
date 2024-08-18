export function sortTable(
    columnIndex,
    order,
    originalData,
    renderTable,
    tbody
) {
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
    renderTable(tbody, data);
}
