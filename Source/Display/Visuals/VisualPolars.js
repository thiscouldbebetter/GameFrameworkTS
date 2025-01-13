"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VisualPolars {
            constructor(polars, color, lineThickness) {
                this.polars = polars;
                this.color = color;
                this.lineThickness = (lineThickness == null ? 1 : lineThickness);
                // temps
                this._polar = new GameFramework.Polar(0, 0, 0);
                this._fromPos = GameFramework.Coords.create();
                this._toPos = GameFramework.Coords.create();
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
                var drawableLoc = GameFramework.Locatable.of(entity).loc;
                var drawablePos = drawableLoc.pos;
                var drawableHeadingInTurns = drawableLoc.orientation.forward.headingInTurns();
                var polar = this._polar;
                var fromPos = this._fromPos.overwriteWith(drawablePos);
                var toPos = this._toPos;
                for (var i = 0; i < this.polars.length; i++) {
                    polar.overwriteWith(this.polars[i]);
                    polar.azimuthInTurns =
                        GameFramework.NumberHelper.wrapToRangeZeroOne(polar.azimuthInTurns + drawableHeadingInTurns);
                    polar.toCoords(toPos).add(fromPos);
                    display.drawLine(fromPos, toPos, this.color, this.lineThickness);
                    fromPos.overwriteWith(toPos);
                }
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
        GameFramework.VisualPolars = VisualPolars;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
