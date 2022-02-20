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
            // methods
            add(other) {
                return this.interpolateWith(other, .5);
            }
            alpha(valueToSet) {
                if (valueToSet != null) {
                    this.componentsRGBA[3] = valueToSet;
                    this._systemColor = null;
                }
                return this.componentsRGBA[3];
            }
            multiplyRGBScalar(scalar) {
                for (var i = 0; i < 3; i++) {
                    this.componentsRGBA[i] *= scalar;
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
                this._Transparent = new Color("Transparent", ".", [0, 0, 0, 0]);
                this.Black = new Color("Black", "k", [0, 0, 0, 1]);
                this.BlackHalfTransparent = new Color("BlackHalfTransparent", "K", [0, 0, 0, .5]);
                this.Blue = new Color("Blue", "b", [0, 0, 1, 1]);
                this.BlueDark = new Color("BlueDark", "B", [0, 0, .5, 1]);
                this.BlueLight = new Color("BlueLight", "$", [.5, .5, 1, 1]);
                this.Brown = new Color("Brown", "O", [0.5, 0.25, 0, 1]);
                this.Cyan = new Color("Cyan", "c", [0, 1, 1, 1]);
                this.Gray = new Color("Gray", "a", [0.5, 0.5, 0.5, 1]);
                this.GrayDark = new Color("GrayDark", "A", [0.25, 0.25, 0.25, 1]);
                this.GrayDarker = new Color("GrayDarker", "#", [0.125, 0.125, 0.125, 1]);
                this.GrayLight = new Color("GrayLight", "@", [0.75, 0.75, 0.75, 1]);
                this.GrayLighter = new Color("GrayLighter", "-", [0.825, 0.825, 0.825, 1]);
                this.Green = new Color("Green", "g", [0, 1, 0, 1]);
                this.GreenDark = new Color("GreenDark", "G", [0, .5, 0, 1]);
                this.GreenDarker = new Color("GreenDarker", "", [0, .25, 0, 1]);
                this.GreenLight = new Color("GreenLight", "%", [.5, 1, .5, 1]);
                this.GreenMediumDark = new Color("GreenMediumDark", "", [0, .75, 0, 1]);
                this.GreenMediumLight = new Color("GreenMediumLight", "", [.25, 1, .25, 1]);
                this.Orange = new Color("Orange", "o", [1, 0.5, 0, 1]);
                this.Pink = new Color("Pink", "p", [1, 0.5, 0.5, 1]);
                this.Red = new Color("Red", "r", [1, 0, 0, 1]);
                this.RedDark = new Color("RedDark", "R", [.5, 0, 0, 1]);
                this.Tan = Color.fromSystemColor("Tan");
                this.Violet = new Color("Violet", "v", [1, 0, 1, 1]);
                this.VioletDark = new Color("VioletDark", "V2", [.5, 0, .5, 1]);
                this.VioletEighth = new Color("VioletEighth", "V8", [.125, 0, .125, 1]);
                this.VioletQuarter = new Color("VioletQuarter", "V4", [.25, 0, .25, 1]);
                this.White = new Color("White", "w", [1, 1, 1, 1]);
                this.Yellow = new Color("Yellow", "y", [1, 1, 0, 1]);
                this.YellowDark = new Color("YellowDark", "Y", [.5, .5, 0, 1]);
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
