"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ControlStyle {
            constructor(name, colorScheme, drawBoxOfSizeAtPosWithColorsToDisplay) {
                this.name = name;
                this.colorScheme = colorScheme;
                this._drawBoxOfSizeAtPosWithColorsToDisplay = drawBoxOfSizeAtPosWithColorsToDisplay;
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
            clone() {
                return new ControlStyle(this.name, this.colorScheme.clone(), this._drawBoxOfSizeAtPosWithColorsToDisplay);
            }
            drawBoxOfSizeAtPosWithColorsToDisplay(size, pos, colorFill, colorBorder, isHighlighted, display) {
                if (this._drawBoxOfSizeAtPosWithColorsToDisplay == null) {
                    if (isHighlighted) {
                        var temp = colorFill;
                        colorFill = colorBorder;
                        colorBorder = temp;
                    }
                    display.drawRectangle(pos, size, colorFill, colorBorder);
                }
                else {
                    this._drawBoxOfSizeAtPosWithColorsToDisplay(size, pos, colorFill, colorBorder, isHighlighted, display);
                }
            }
            // Colors.
            colorBackground() { return this.colorScheme.colorBackground; }
            colorBorder() { return this.colorScheme.colorBorder; }
            colorDisabled() { return this.colorScheme.colorDisabled; }
            colorFill() { return this.colorScheme.colorFill; }
        }
        GameFramework.ControlStyle = ControlStyle;
        class ControlStyle_Instances {
            constructor() {
                this.Default = new ControlStyle("Default", // name
                GameFramework.ControlColorScheme.Instances().Default, null // drawBoxOfSizeAtPosToDisplay
                );
                this.Beveled = this.beveled();
                this.Dark = new ControlStyle("Dark", // name
                GameFramework.ControlColorScheme.Instances().Dark, null // drawBoxOfSizeAtPosToDisplay
                );
                this.Rounded = this.rounded();
                this._All =
                    [
                        this.Default, this.Dark, this.Rounded
                    ];
                this._AllByName = GameFramework.ArrayHelper.addLookupsByName(this._All);
            }
            beveled() {
                var beveled = this.Default.clone();
                var cornerRadius = 5;
                beveled._drawBoxOfSizeAtPosWithColorsToDisplay =
                    (size, pos, colorFill, colorBorder, isHighlighted, display) => {
                        if (isHighlighted) {
                            var temp = colorFill;
                            colorFill = colorBorder;
                            colorBorder = temp;
                        }
                        display.drawRectangleWithBeveledCorners(pos, size, colorFill, colorBorder, cornerRadius);
                    };
                return beveled;
            }
            rounded() {
                var rounded = this.Default.clone();
                var cornerRadius = 5;
                rounded._drawBoxOfSizeAtPosWithColorsToDisplay =
                    (size, pos, colorFill, colorBorder, isHighlighted, display) => {
                        if (isHighlighted) {
                            var temp = colorFill;
                            colorFill = colorBorder;
                            colorBorder = temp;
                        }
                        display.drawRectangleWithRoundedCorners(pos, size, colorFill, colorBorder, cornerRadius);
                    };
                return rounded;
            }
        }
        GameFramework.ControlStyle_Instances = ControlStyle_Instances;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
