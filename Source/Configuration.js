"use strict";
class Configuration {
    constructor() {
        this.contentDirectoryPath = "../Content/";
        this.displaySizesAvailable = [Coords.fromXYZ(640, 480, 1)];
    }
    static Instance() {
        if (this._instance == null) {
            this._instance = new Configuration();
        }
        return this._instance;
    }
}
