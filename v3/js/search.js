export function highlightSearchResults(searchText) {
    clearHighlights();

    const cells = tbody.querySelectorAll("td");
    cells.forEach((cell) => {
        const input =
            cell.querySelector("input") || cell.querySelector("select");
        if (input && input.value.includes(searchText)) {
            cell.classList.add("highlight");
        }
    });
}
