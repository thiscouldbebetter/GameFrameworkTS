"use strict";
class Configuration {
    constructor() {
        this.contentDirectoryPath = "../Content/";
        this.displaySizesAvailable = null;
    }
    static Instance() {
        if (this._instance == null) {
            this._instance = new Configuration();
        }
        return this._instance;
    }
}
