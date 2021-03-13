"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
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
            static byName(styleName) {
                return ControlStyle.Instances()._AllByName.get(styleName);
            }
        }
        GameFramework.ControlStyle = ControlStyle;
        class ControlStyle_Instances {
            constructor() {
                this.Default = new ControlStyle("Default", // name
                GameFramework.Color.fromRGB(240 / 255, 240 / 255, 240 / 255), // colorBackground
                GameFramework.Color.byName("White"), // colorFill
                GameFramework.Color.byName("Gray"), // colorBorder
                GameFramework.Color.byName("GrayLight") // colorDisabled
                );
                this.Dark = new ControlStyle("Dark", // name
                GameFramework.Color.byName("GrayDark"), // colorBackground
                GameFramework.Color.byName("Black"), // colorFill
                GameFramework.Color.byName("White"), // colorBorder
                GameFramework.Color.byName("GrayLight") // colorDisabled
                );
                this._All = [this.Default, this.Dark];
                this._AllByName = GameFramework.ArrayHelper.addLookupsByName(this._All);
            }
        }
        GameFramework.ControlStyle_Instances = ControlStyle_Instances;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
