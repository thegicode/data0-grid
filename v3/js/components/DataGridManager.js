class DataGridManager {
    constructor(initialData = []) {
        this._data = Array.isArray(initialData) ? [...initialData] : [];
    }

    get data() {
        return this._data.map((item) => ({ ...item }));
    }

    set data(newData) {
        if (Array.isArray(newData)) {
            this._data = newData.map((item) => ({ ...item }));
        } else {
            console.error("Data must be an array.");
        }
    }
}

export default new DataGridManager();
