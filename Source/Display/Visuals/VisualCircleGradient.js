"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VisualCircleGradient {
            constructor(radius, gradientFill, colorBorder) {
                this.radius = radius;
                this.gradientFill = gradientFill;
                this.colorBorder = colorBorder;
            }
            draw(uwpe, display) {
                var entity = uwpe.entity;
                var drawPos = entity.locatable().loc.pos;
                display.drawCircleWithGradient(drawPos, this.radius, this.gradientFill, this.colorBorder);
            }
            // Clonable.
            clone() {
                return this; // todo
            }
            overwriteWith(other) {
                return this; // todo
            }
            // Transformable.
            transform(transformToApply) {
                return this; // todo
            }
        }
        GameFramework.VisualCircleGradient = VisualCircleGradient;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
