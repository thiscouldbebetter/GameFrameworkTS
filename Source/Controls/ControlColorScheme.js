"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ControlColorScheme {
            constructor(name, colorBackground, colorFill, colorBorder, colorDisabled) {
                this.name = name;
                this.colorBackground = colorBackground;
                this.colorFill = colorFill;
                this.colorBorder = colorBorder;
                this.colorDisabled = colorDisabled;
            }
            static Instances() {
                if (ControlColorScheme._instances == null) {
                    ControlColorScheme._instances = new ControlColorScheme_Instances();
                }
                return ControlColorScheme._instances;
            }
            static byName(colorSchemeName) {
                return ControlColorScheme.Instances()._AllByName.get(colorSchemeName);
            }
            clone() {
                return new ControlColorScheme(this.name, this.colorBackground, this.colorFill, this.colorBorder, this.colorDisabled);
            }
        }
        GameFramework.ControlColorScheme = ControlColorScheme;
        class ControlColorScheme_Instances {
            constructor() {
                this.Default = new ControlColorScheme("Default", // name
                GameFramework.Color.fromRGB(240 / 255, 240 / 255, 240 / 255), // colorBackground
                GameFramework.Color.byName("White"), // colorFill
                GameFramework.Color.byName("Gray"), // colorBorder
                GameFramework.Color.byName("GrayLight") // colorDisabled
                );
                this.Dark = new ControlColorScheme("Dark", // name
                GameFramework.Color.byName("GrayDark"), // colorBackground
                GameFramework.Color.byName("Black"), // colorFill
                GameFramework.Color.byName("White"), // colorBorder
                GameFramework.Color.byName("GrayLight") // colorDisabled
                );
                this._All =
                    [
                        this.Default, this.Dark
                    ];
                this._AllByName = GameFramework.ArrayHelper.addLookupsByName(this._All);
            }
        }
        GameFramework.ControlColorScheme_Instances = ControlColorScheme_Instances;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
