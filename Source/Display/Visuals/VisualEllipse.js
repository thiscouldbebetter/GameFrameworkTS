"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VisualEllipse {
            constructor(semiaxisHorizontal, semiaxisVertical, rotationInTurns, colorFill, colorBorder, shouldUseEntityOrientation) {
                this.semiaxisHorizontal = semiaxisHorizontal;
                this.semiaxisVertical = semiaxisVertical;
                this.rotationInTurns = rotationInTurns || 0;
                this.colorFill = colorFill;
                this.colorBorder = colorBorder;
                this.shouldUseEntityOrientation = shouldUseEntityOrientation || false;
            }
            static fromSemiaxesAndColorFill(semiaxisHorizontal, semiaxisVertical, colorFill) {
                return new VisualEllipse(semiaxisHorizontal, semiaxisVertical, null, colorFill, null, null);
            }
            draw(uwpe, display) {
                var entity = uwpe.entity;
                var drawableLoc = GameFramework.Locatable.of(entity).loc;
                var rotationInTurns = this.rotationInTurns;
                if (this.shouldUseEntityOrientation) {
                    var drawableOrientation = drawableLoc.orientation;
                    var drawableRotationInTurns = drawableOrientation.forward.headingInTurns();
                    rotationInTurns += drawableRotationInTurns;
                }
                display.drawEllipse(drawableLoc.pos, this.semiaxisHorizontal, this.semiaxisVertical, GameFramework.NumberHelper.wrapToRangeZeroOne(rotationInTurns), this.colorFill, this.colorBorder);
            }
            // Clonable.
            clone() {
                return new VisualEllipse(this.semiaxisHorizontal, this.semiaxisVertical, this.rotationInTurns, this.colorFill, this.colorBorder, this.shouldUseEntityOrientation);
            }
            overwriteWith(other) {
                this.semiaxisHorizontal = other.semiaxisHorizontal;
                this.semiaxisVertical = other.semiaxisVertical;
                this.rotationInTurns = other.rotationInTurns;
                this.colorFill = other.colorFill;
                this.colorBorder = other.colorBorder;
                this.shouldUseEntityOrientation = other.shouldUseEntityOrientation;
                return this; // todo
            }
            // Transformable.
            transform(transformToApply) {
                return this; // todo
            }
        }
        GameFramework.VisualEllipse = VisualEllipse;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
