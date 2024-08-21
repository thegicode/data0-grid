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

    updateFieldValue(id, title, value) {
        const index = this._data.findIndex((item) => item.id === id);
        if (index !== -1) {
            this._data[index] = {
                ...this._data[index],
                [title]: value,
            };
            console.log(
                `Data updated at id: ${id}, title: ${title} to ${value}`
            );
        } else {
            console.error(`Record with id: ${id} not found.`);
        }
    }

    // Method to add a new record to the data
    // addRecord(record) {
    //     if (record && typeof record === "object") {
    //         this._data.push({ ...record });
    //     } else {
    //         console.error("Invalid record. Must be an object.");
    //     }
    // }

    // Method to update a record by index
    // updateRecord(index, updatedRecord) {
    //     if (index >= 0 && index < this._data.length) {
    //         this._data[index] = { ...this._data[index], ...updatedRecord };
    //     } else {
    //         console.error("Invalid index for update.");
    //     }
    // }

    // Method to delete a record by index
    // deleteRecord(index) {
    //     if (index >= 0 && index < this._data.length) {
    //         this._data.splice(index, 1);
    //     } else {
    //         console.error("Invalid index for deletion.");
    //     }
    // }
}

export default new DataGridManager();
