export default class DataModel {
    private _records: IDataItem[] = [];

    constructor(initialData = []) {
        this._records = Array.isArray(initialData) ? [...initialData] : [];
    }

    get records() {
        return this._records.map((item) => ({ ...item }));
    }

    set records(newData) {
        if (Array.isArray(newData)) {
            this._records = newData.map((item) => ({ ...item }));
        } else {
            console.error("Data must be an array.");
        }
    }

    updateFieldValue(id: string, key: string, value: TDataValue) {
        const index = this._records.findIndex((item) => item.id === id);
        if (index !== -1) {
            this._records[index] = {
                ...this._records[index],
                [key]: value,
            };
            console.log(this.records[index]); // 수정된 데이터를 출력합니다.
        } else {
            console.error(`Record with id: ${id} not found.`);
        }
    }

    updateRecordFields(updateData: IDataItem) {
        const { id, ...fieldsToUpdate } = updateData;
        const recordIndex = this._records.findIndex((item) => item.id === id);

        if (recordIndex !== -1) {
            this._records[recordIndex] = {
                ...this._records[recordIndex],
                ...fieldsToUpdate,
            };
            console.log(this.records[recordIndex]); // 수정된 데이터를 출력합니다.
        } else {
            console.error(`Record with id: ${id} not found.`);
        }
    }

    // Method to add a new record to the data
    // addRecord(record) {
    //     if (record && typeof record === "object") {
    //         this._records.push({ ...record });
    //     } else {
    //         console.error("Invalid record. Must be an object.");
    //     }
    // }

    // Method to update a record by index
    // updateRecord(index, updatedRecord) {
    //     if (index >= 0 && index < this._records.length) {
    //         this._records[index] = { ...this._records[index], ...updatedRecord };
    //     } else {
    //         console.error("Invalid index for update.");
    //     }
    // }

    // Method to delete a record by index
    // deleteRecord(index) {
    //     if (index >= 0 && index < this._records.length) {
    //         this._records.splice(index, 1);
    //     } else {
    //         console.error("Invalid index for deletion.");
    //     }
    // }
}
