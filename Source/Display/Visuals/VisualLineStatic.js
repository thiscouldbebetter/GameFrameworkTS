"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VisualLineStatic extends GameFramework.VisualBase {
            constructor(fromPos, toPos, color, lineThickness) {
                super();
                this.fromPos = fromPos;
                this.toPos = toPos;
                this.color = color;
                this.lineThickness = lineThickness || 1;
                // Helper variables.
                this._drawPosFrom = Coords.create();
                this._drawPosTo = Coords.create();
                this._transformTranslate = new Transform_Translate(null);
            }
            static fromFromAndToPosColorAndThickness(fromPos, toPos, color, lineThickness) {
                return new VisualLineStatic(fromPos, toPos, color, lineThickness);
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
                var entityPos = GameFramework.Locatable.of(entity).loc.pos;
                var transform = this._transformTranslate;
                transform.displacement = entityPos;
                var drawPosFrom = this._drawPosFrom.overwriteWith(this.fromPos);
                transform.transformCoords(drawPosFrom);
                var drawPosTo = this._drawPosTo.overwriteWith(this.toPos);
                transform.transformCoords(drawPosTo);
                display.drawLine(drawPosFrom, drawPosTo, this.color, this.lineThickness);
            }
            // Clonable.
            clone() {
                return new VisualLineStatic(this.fromPos.clone(), this.toPos.clone(), this.color.clone(), this.lineThickness);
            }
            overwriteWith(other) {
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
        GameFramework.VisualLineStatic = VisualLineStatic;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
