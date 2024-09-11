import dataModel from "../models/DataModel";

export default class DataGrid extends HTMLElement {
    public dataModel;

    constructor() {
        super();

        this.dataModel = dataModel;
        // this.selection = new Selection(this);

        // this.table = this.querySelector("table");
        // this.thead = this.querySelector("thead");
        // this.tbody = this.querySelector("tbody");
        // this.csvButton = this.querySelector(".csv-button");
        // this.dataButton = this.querySelector(".data-button");

        // this.isComposing = false;
    }
}
