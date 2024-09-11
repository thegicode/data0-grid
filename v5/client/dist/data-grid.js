"use strict";
(() => {
  // src/data-grid.ts
  var dataGrid = document.getElementById("data-grid");
  var gridData = [
    { id: 1, name: "Item 1", description: "Description 1" },
    { id: 2, name: "Item 2", description: "Description 2" },
    { id: 3, name: "Item 3", description: "Description 3" }
  ];
  var table = document.createElement("table");
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
})();
