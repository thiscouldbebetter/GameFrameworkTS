"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VisualCircleGradient extends GameFramework.VisualBase {
            constructor(radius, gradientFill, colorBorder) {
                super();
                this.radius = radius;
                this.gradientFill = gradientFill;
                this.colorBorder = colorBorder;
            }
            // Visual.
            initialize(uwpe) {
                // Do nothing.
            }
            initializeIsComplete(uwpe) {
                return true;
            }
            draw(uwpe, display) {
                var entity = uwpe.entity;
                var drawPos = GameFramework.Locatable.of(entity).loc.pos;
                display.drawCircleWithGradient(drawPos, this.radius, this.gradientFill, this.colorBorder);
            }
            // Clonable.
            clone() {
                return new VisualCircleGradient(this.radius, this.gradientFill, this.colorBorder);
            }
            overwriteWith(other) {
                this.radius = other.radius;
                this.gradientFill = other.gradientFill;
                this.colorBorder = other.colorBorder;
                return this;
            }
            // Transformable.
            transform(transformToApply) {
                return this; // todo
            }
        }
        GameFramework.VisualCircleGradient = VisualCircleGradient;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
