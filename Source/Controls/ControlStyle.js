"use strict";
class ControlStyle {
    constructor(name, colorBackground, colorFill, colorBorder, colorDisabled) {
        this.name = name;
        this.colorBackground = colorBackground;
        this.colorFill = colorFill;
        this.colorBorder = colorBorder;
        this.colorDisabled = colorDisabled;
    }
    static Instances() {
        if (ControlStyle._instances == null) {
            ControlStyle._instances = new ControlStyle_Instances();
        }
        return ControlStyle._instances;
    }
    ;
}
class ControlStyle_Instances {
    constructor() {
        this.Default = new ControlStyle("Default", // name
        "rgb(240, 240, 240)", // colorBackground
        "White", // colorFill
        "Gray", // colorBorder
        "LightGray" // colorDisabled
        );
    }
}
