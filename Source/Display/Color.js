"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Color {
            constructor(name, code, componentsRGBA) {
                this.name = name;
                this.code = code;
                this.componentsRGBA = componentsRGBA;
            }
            static byName(colorName) {
                return Color.Instances()._AllByName.get(colorName);
            }
            static create() {
                return Color.fromRGB(0, 0, 0); // Black.
            }
            static default() {
                return Color.create();
            }
            static fromRGB(red, green, blue) {
                return new Color(null, null, [red, green, blue, 1]);
            }
            static fromSystemColor(systemColor) {
                var returnValue = new Color(systemColor, null, null);
                returnValue._systemColor = systemColor;
                return returnValue;
            }
            static grayWithValue(value) {
                return Color.fromRGB(value, value, value);
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
            // methods
            add(other) {
                return this.interpolateWith(other, .5);
            }
            alpha() {
                return this.componentsRGBA[3];
            }
            alphaSet(valueToSet) {
                this.componentsRGBA[3] = valueToSet;
                this._systemColor = null;
                return this;
            }
            componentsRGB() {
                return this.componentsRGBA.slice(0, 3);
            }
            darken() {
                return this.multiplyRGBScalar(.5);
            }
            isBlack() {
                return (this.componentsRGB().some(x => x > 0) == false);
            }
            isTransparent() {
                return (this.alpha() < 1);
            }
            isWhite() {
                return (this.componentsRGB().some(x => x < 1) == false);
            }
            lighten() {
                return this.multiplyRGBScalar(2);
            }
            multiplyRGBScalar(scalar) {
                for (var i = 0; i < 3; i++) {
                    this.componentsRGBA[i] *= scalar;
                    if (this.componentsRGBA[i] > 1) {
                        this.componentsRGBA[i] = 1;
                    }
                }
                return this;
            }
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
            value() {
                // This is "value" as in how dark or light the color is.
                var returnValue = (this.componentsRGBA[0]
                    + this.componentsRGBA[1]
                    + this.componentsRGBA[2]) / 3;
                return returnValue;
            }
            valueMultiplyByScalar(scalar) {
                // This is "value" as in how dark or light the color is.
                for (var i = 0; i < 3; i++) {
                    var component = this.componentsRGBA[i];
                    component = Math.round(component * scalar);
                    if (component > 1) {
                        component = 1;
                    }
                    this.componentsRGBA[i] = component;
                }
                return this;
            }
            // Clonable.
            clone() {
                return new Color(this.name, this.code, this.componentsRGBA.slice());
            }
            overwriteWith(other) {
                this.name = other.name;
                this.code = other.code;
                GameFramework.ArrayHelper.overwriteWithNonClonables(this.componentsRGBA, other.componentsRGBA);
                this._systemColor = null;
                return this;
            }
            overwriteWithComponentsRGBA255(otherAsComponentsRGBA255) {
                this.componentsRGBA[0] = otherAsComponentsRGBA255[0] / 255;
                this.componentsRGBA[1] = otherAsComponentsRGBA255[1] / 255;
                this.componentsRGBA[2] = otherAsComponentsRGBA255[2] / 255;
                this.componentsRGBA[3] = otherAsComponentsRGBA255[3] / 255; // Alpha is integer <= 255 in this case.
                return this;
            }
            // Interpolatable.
            interpolateWith(other, fractionOfProgressTowardOther) {
                var fractionOfProgressTowardOtherReversed = 1 - fractionOfProgressTowardOther;
                var componentsRGBAThis = this.componentsRGBA;
                var componentsRGBAOther = other.componentsRGBA;
                var componentsRGBAInterpolated = new Array();
                for (var i = 0; i < componentsRGBAThis.length; i++) {
                    var componentThis = componentsRGBAThis[i];
                    var componentOther = componentsRGBAOther[i];
                    var componentInterpolated = componentThis * fractionOfProgressTowardOtherReversed
                        + componentOther * fractionOfProgressTowardOther;
                    componentsRGBAInterpolated[i] = componentInterpolated;
                    componentsRGBAThis[i] = componentInterpolated;
                }
                return this;
            }
        }
        // constants
        Color.NumberOfComponentsRGBA = 4;
        GameFramework.Color = Color;
        class Color_Instances {
            constructor() {
                var c = (name, code, componentsRgba) => new Color(name, code, componentsRgba);
                this._Transparent = c("Transparent", ".", [0, 0, 0, 0]);
                this.Black = c("Black", "k", [0, 0, 0, 1]);
                this.BlackHalfTransparent = c("BlackHalfTransparent", "K", [0, 0, 0, .5]);
                this.Blue = c("Blue", "b", [0, 0, 1, 1]);
                this.BlueDark = c("BlueDark", "B", [0, 0, .5, 1]);
                this.BlueLight = c("BlueLight", "$", [.5, .5, 1, 1]);
                this.Brown = c("Brown", "O", [0.5, 0.25, 0, 1]);
                this.Cyan = c("Cyan", "c", [0, 1, 1, 1]);
                this.Gold = c("Gold", null, [.5, .5, 0, 1]);
                this.Gray = c("Gray", "a", [0.5, 0.5, 0.5, 1]);
                this.GrayDark = c("GrayDark", "A", [0.25, 0.25, 0.25, 1]);
                this.GrayDarker = c("GrayDarker", "#", [0.125, 0.125, 0.125, 1]);
                this.GrayLight = c("GrayLight", "@", [0.75, 0.75, 0.75, 1]);
                this.GrayLighter = c("GrayLighter", "-", [0.825, 0.825, 0.825, 1]);
                this.Green = c("Green", "g", [0, 1, 0, 1]);
                this.GreenDark = c("GreenDark", "G", [0, .5, 0, 1]);
                this.GreenDarker = c("GreenDarker", "", [0, .25, 0, 1]);
                this.GreenLight = c("GreenLight", "%", [.5, 1, .5, 1]);
                this.GreenMediumDark = c("GreenMediumDark", "", [0, .75, 0, 1]);
                this.GreenMediumLight = c("GreenMediumLight", "", [.25, 1, .25, 1]);
                this.Orange = c("Orange", "o", [1, 0.5, 0, 1]);
                this.Pink = c("Pink", "p", [1, 0.5, 0.5, 1]);
                this.Purple = c("Purple", null, [0.5, 0, 0.5, 1]);
                this.Red = c("Red", "r", [1, 0, 0, 1]);
                this.RedDark = c("RedDark", "R", [.5, 0, 0, 1]);
                this.Tan = c("Tan", "T", [.8, .7, .5, 1]);
                this.Violet = c("Violet", "v", [1, 0, 1, 1]);
                this.VioletDark = c("VioletDark", "V2", [.5, 0, .5, 1]);
                this.VioletEighth = c("VioletEighth", "V8", [.125, 0, .125, 1]);
                this.VioletQuarter = c("VioletQuarter", "V4", [.25, 0, .25, 1]);
                this.White = c("White", "w", [1, 1, 1, 1]);
                this.Yellow = c("Yellow", "y", [1, 1, 0, 1]);
                this.YellowDark = c("YellowDark", "Y", [.5, .5, 0, 1]);
                this._All =
                    [
                        this._Transparent,
                        this.Black,
                        this.BlackHalfTransparent,
                        this.Blue,
                        this.BlueDark,
                        this.BlueLight,
                        this.Brown,
                        this.Cyan,
                        this.Gold,
                        this.Gray,
                        this.GrayDark,
                        this.GrayDarker,
                        this.GrayLight,
                        this.GrayLighter,
                        this.Green,
                        this.GreenDark,
                        this.GreenDarker,
                        this.GreenLight,
                        this.GreenMediumDark,
                        this.GreenMediumLight,
                        this.Orange,
                        this.Pink,
                        this.Purple,
                        this.Red,
                        this.RedDark,
                        this.Tan,
                        this.Violet,
                        this.VioletDark,
                        this.VioletEighth,
                        this.VioletQuarter,
                        this.White,
                        this.Yellow,
                        this.YellowDark,
                    ];
                this._AllByCode = GameFramework.ArrayHelper.addLookups(this._All, (x) => x.code);
                this._AllByName = GameFramework.ArrayHelper.addLookupsByName(this._All);
            }
        }
        GameFramework.Color_Instances = Color_Instances;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
