export default class Sort {
    constructor(thead, dataModel, titles) {
        this.lastSortedColumn = null; // 마지막으로 정렬된 열 이름
        this.currentSortOrder = "none"; // 현재 정렬 순서

        this.thead = thead;
        this.dataModel = dataModel;
        this.sortButtons = {}; // 각 열에 대한 정렬 버튼을 저장하는 객체
        this.createSorts(titles);
    }

    createSorts(titles) {
        const ths = this.thead.querySelectorAll("th");
        ths.forEach((th) => {
            if (titles.includes(th.textContent)) {
                const button = this.createSortButton();
                this.bindEvents(th, button);
                th.appendChild(button);
                this.sortButtons[th.textContent] = button; // 버튼을 저장
            }
        });
    }

    createSortButton() {
        const button = document.createElement("button");
        button.type = "button";
        const span = document.createElement("span");
        span.className = "icon-triangle";
        button.appendChild(span);
        return button;
    }

    bindEvents(th, button) {
        button.addEventListener("click", this.onClick.bind(this, th, button));
    }

    onClick(th, button, e) {
        const columnName = th.textContent;

        // 정렬이 새로 적용되는 열인지 확인
        if (this.lastSortedColumn !== columnName) {
            this.resetSortOrder(); // 다른 열의 정렬 상태 초기화
            this.currentSortOrder = "none"; // 현재 열의 정렬 상태 초기화
        }

        // 정렬 순서: none -> ascending -> descending -> none
        if (this.currentSortOrder === "none") {
            this.currentSortOrder = "ascending";
        } else if (this.currentSortOrder === "ascending") {
            this.currentSortOrder = "descending";
        } else {
            this.currentSortOrder = "none";
        }

        button.dataset.sort = this.currentSortOrder;

        if (this.currentSortOrder === "none") {
            this.renderOriginalTable();
        } else {
            this.sortTable(columnName, this.currentSortOrder);
        }

        this.lastSortedColumn = columnName; // 마지막으로 정렬된 열 업데이트
    }

    resetSortOrder() {
        // 모든 정렬 버튼의 상태를 초기화
        Object.keys(this.sortButtons).forEach((column) => {
            this.sortButtons[column].dataset.sort = "none";
        });
    }

    sortTable(columnName, order) {
        let data = [...this.dataModel.records];

        data.sort((a, b) => {
            if (a[columnName] < b[columnName])
                return order === "ascending" ? -1 : 1;
            if (a[columnName] > b[columnName])
                return order === "ascending" ? 1 : -1;
            return 0;
        });

        console.log(this.currentSortOrder);
        console.log(data);
        // renderTable(tbody, data);
    }

    renderOriginalTable() {
        // 원본 데이터로 테이블을 렌더링하는 로직 구현
        console.log("Rendering original table");
    }
}
