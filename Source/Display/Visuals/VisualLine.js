"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VisualLine {
            constructor(fromPos, toPos, color, lineThickness) {
                this.fromPos = fromPos;
                this.toPos = toPos;
                this.color = color;
                this.lineThickness = lineThickness || 1;
                // Helper variables.
                this._drawPosFrom = GameFramework.Coords.create();
                this._drawPosTo = GameFramework.Coords.create();
                this._transformLocate = new GameFramework.Transform_Locate(null);
            }
            draw(universe, world, place, entity, display) {
                var loc = entity.locatable().loc;
                this._transformLocate.loc = loc;
                var drawPosFrom = this._drawPosFrom.overwriteWith(this.fromPos);
                this._transformLocate.transformCoords(drawPosFrom);
                var drawPosTo = this._drawPosTo.overwriteWith(this.toPos);
                this._transformLocate.transformCoords(drawPosTo);
                display.drawLine(drawPosFrom, drawPosTo, this.color.systemColor(), this.lineThickness);
            }
            // Clonable.
            clone() {
                return new VisualLine(this.fromPos.clone(), this.toPos.clone(), this.color.clone(), this.lineThickness);
            }
            overwriteWith(otherAsVisual) {
                var other = otherAsVisual;
                this.fromPos.overwriteWith(other.fromPos);
                this.toPos.overwriteWith(other.toPos);
                this.color.overwriteWith(other.color);
                this.lineThickness = other.lineThickness;
                return this;
            }
            // Transformable.
            transform(transformToApply) {
                transformToApply.transformCoords(this.fromPos);
                transformToApply.transformCoords(this.toPos);
                return this;
            }
        }
        GameFramework.VisualLine = VisualLine;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
