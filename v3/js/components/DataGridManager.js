export default class DataGridManager {
    constructor(data) {
        this._data = data;
    }

    get data() {
        return [...this._data];
    }

    set data(data) {
        this._data = data;
    }
}
