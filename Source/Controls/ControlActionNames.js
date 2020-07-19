"use strict";
class ControlActionNames_Instances {
    constructor() {
        this.ControlCancel = "ControlCancel";
        this.ControlConfirm = "ControlConfirm";
        this.ControlDecrement = "ControlDecrement";
        this.ControlIncrement = "ControlIncrement";
        this.ControlNext = "ControlNext";
        this.ControlPrev = "ControlPrev";
    }
}
class ControlActionNames {
    static Instances() {
        if (ControlActionNames._instances == null) {
            ControlActionNames._instances = new ControlActionNames_Instances();
        }
        return ControlActionNames._instances;
    }
    ;
}
