// 간단한 데이터 그리드 예제
const dataGrid = document.getElementById("data-grid");

const gridData = [
    { id: 1, name: "Item 1", description: "Description 1" },
    { id: 2, name: "Item 2", description: "Description 2" },
    { id: 3, name: "Item 3", description: "Description 3" },
];

const table = document.createElement("table");
gridData.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${item.id}</td>
        <td>${item.name}</td>
        <td>${item.description}</td>
    `;
    table.appendChild(row);
});

if (dataGrid) {
    dataGrid.appendChild(table);
}
