"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VisualEllipse {
            constructor(semimajorAxis, semiminorAxis, rotationInTurns, colorFill, colorBorder) {
                this.semimajorAxis = semimajorAxis;
                this.semiminorAxis = semiminorAxis;
                this.rotationInTurns = rotationInTurns;
                this.colorFill = colorFill;
                this.colorBorder = colorBorder;
            }
            draw(universe, world, place, entity, display) {
                var drawableLoc = entity.locatable().loc;
                var drawableOrientation = drawableLoc.orientation;
                var drawableRotationInTurns = drawableOrientation.forward.headingInTurns();
                display.drawEllipse(drawableLoc.pos, this.semimajorAxis, this.semiminorAxis, GameFramework.NumberHelper.wrapToRangeZeroOne(this.rotationInTurns + drawableRotationInTurns), GameFramework.Color.systemColorGet(this.colorFill), GameFramework.Color.systemColorGet(this.colorBorder));
            }
            ;
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
        GameFramework.VisualEllipse = VisualEllipse;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
