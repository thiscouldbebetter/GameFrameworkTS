"use strict";
class Device {
    constructor(name, initialize, update, use) {
        this.name = name;
        this.initialize = initialize;
        this.update = update;
        this.use = use;
    }
    // clonable
    clone() {
        return new Device(this.name, this.initialize, this.update, this.use);
    }
    ;
}
