"use strict";
class Profile {
    constructor(name, saveStates) {
        this.name = name;
        this.saveStates = saveStates;
        this.saveStateNameSelected = null;
    }
    saveStateSelected() {
        return this.saveStates.filter(x => x.name == this.saveStateNameSelected)[0];
    }
}
