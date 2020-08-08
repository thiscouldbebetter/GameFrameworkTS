"use strict";
class Color {
    constructor(name, code, componentsRGBA) {
        this.name = name;
        this.code = code;
        this.componentsRGBA = componentsRGBA;
    }
    static byName(colorName) {
        return Color.Instances()._AllByName.get(colorName);
    }
    static fromRGB(red, green, blue) {
        return new Color(null, null, [red, green, blue, 1]);
    }
    static fromSystemColor(systemColor) {
        var returnValue = new Color(systemColor, null, null);
        returnValue._systemColor = systemColor;
        return returnValue;
    }
    static systemColorGet(color) {
        return (color == null ? null : color.systemColor());
    }
    static Instances() {
        if (Color._instances == null) {
            Color._instances = new Color_Instances();
        }
        return Color._instances;
    }
    ;
    // methods
    alpha(valueToSet) {
        if (valueToSet != null) {
            this.componentsRGBA[3] = valueToSet;
            this._systemColor = null;
        }
        return this.componentsRGBA[3];
    }
    ;
    multiplyRGBScalar(scalar) {
        for (var i = 0; i < 3; i++) {
            this.componentsRGBA[i] *= scalar;
        }
        return this;
    }
    ;
    systemColor() {
        if (this._systemColor == null) {
            this._systemColor =
                "rgba("
                    + Math.floor(255 * this.componentsRGBA[0]) + ", "
                    + Math.floor(255 * this.componentsRGBA[1]) + ", "
                    + Math.floor(255 * this.componentsRGBA[2]) + ", "
                    + this.componentsRGBA[3]
                    + ")";
        }
        return this._systemColor;
    }
    ;
    // Clonable.
    clone() {
        return new Color(this.name, this.code, this.componentsRGBA.slice());
    }
    overwriteWith(other) {
        this.name = other.name;
        this.code = other.code;
        ArrayHelper.overwriteWith(this.componentsRGBA, other.componentsRGBA);
        this._systemColor = null;
        return this;
    }
}
// constants
Color.NumberOfComponentsRGBA = 4;
class Color_Instances {
    constructor() {
        this._Transparent = new Color("Transparent", ".", [0, 0, 0, 0]);
        this.Black = new Color("Black", "k", [0, 0, 0, 1]);
        this.Blue = new Color("Blue", "b", [0, 0, 1, 1]);
        this.BlueDark = new Color("BlueDark", "B", [0, 0, .5, 1]);
        this.Brown = new Color("Brown", "O", [0.5, 0.25, 0, 1]);
        this.Cyan = new Color("Cyan", "c", [0, 1, 1, 1]);
        this.Gray = new Color("Gray", "a", [0.5, 0.5, 0.5, 1]);
        this.GrayDark = new Color("GrayDark", "A", [0.25, 0.25, 0.25, 1]);
        this.GrayLight = new Color("GrayLight", "@", [0.75, 0.75, 0.75, 1]);
        this.Green = new Color("Green", "g", [0, 1, 0, 1]);
        this.GreenDark = new Color("GreenDark", "G", [0, .5, 0, 1]);
        this.Orange = new Color("Orange", "o", [1, 0.5, 0, 1]);
        this.Pink = new Color("Pink", "p", [1, 0.5, 0.5, 1]);
        this.Red = new Color("Red", "r", [1, 0, 0, 1]);
        this.RedDark = new Color("RedDark", "R", [.5, 0, 0, 1]);
        this.Tan = Color.fromSystemColor("Tan");
        this.Violet = new Color("Violet", "v", [1, 0, 1, 1]);
        this.White = new Color("White", "w", [1, 1, 1, 1]);
        this.Yellow = new Color("Yellow", "y", [1, 1, 0, 1]);
        this.YellowDark = new Color("YellowDark", "Y", [.5, .5, 0, 1]);
        this._All =
            [
                this._Transparent,
                this.Black,
                this.Blue,
                this.BlueDark,
                this.Brown,
                this.Cyan,
                this.Gray,
                this.GrayDark,
                this.GrayLight,
                this.Green,
                this.GreenDark,
                this.Orange,
                this.Pink,
                this.Red,
                this.RedDark,
                this.Tan,
                this.Violet,
                this.White,
                this.Yellow,
                this.YellowDark,
            ];
        this._AllByCode = ArrayHelper.addLookups(this._All, (x) => x.code);
        this._AllByName = ArrayHelper.addLookupsByName(this._All);
    }
}
