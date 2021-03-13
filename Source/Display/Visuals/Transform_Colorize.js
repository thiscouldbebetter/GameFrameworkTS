"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Transform_Colorize {
            constructor(colorFill, colorBorder) {
                this.colorFill = colorFill;
                this.colorBorder = colorBorder;
            }
            overwriteWith(other) {
                return this; // todo
            }
            transform(transformable) {
                var transformableAsAny = transformable;
                if (transformableAsAny.colorFill == null) {
                    transformable.transform(this);
                }
                else {
                    var transformableAsColorable = transformableAsAny;
                    var colorFill = transformableAsColorable.colorFill;
                    var colorBorder = transformableAsColorable.colorBorder;
                    if (colorFill != null && this.colorFill != null) {
                        colorFill.overwriteWith(this.colorFill);
                    }
                    if (colorBorder != null && this.colorBorder != null) {
                        colorBorder.overwriteWith(this.colorBorder);
                    }
                }
                return transformable;
            }
            transformCoords(coordsToTransform) {
                return coordsToTransform; // todo
            }
        }
        GameFramework.Transform_Colorize = Transform_Colorize;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
