"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VisualArc {
            constructor(radiusOuter, radiusInner, directionMin, angleSpannedInTurns, colorFill, colorBorder) {
                this.radiusOuter = radiusOuter;
                this.radiusInner = radiusInner;
                this.directionMin = directionMin;
                this.angleSpannedInTurns = angleSpannedInTurns;
                this.colorFill = colorFill;
                this.colorBorder = colorBorder;
                // helper variables
                this._drawPos = GameFramework.Coords.create();
                this._polar = GameFramework.Polar.create();
            }
            draw(uwpe, display) {
                var entity = uwpe.entity;
                var drawableLoc = entity.locatable().loc;
                var drawPos = this._drawPos.overwriteWith(drawableLoc.pos);
                var drawableAngleInTurns = drawableLoc.orientation.forward.headingInTurns();
                var wedgeAngleMin = drawableAngleInTurns
                    + this._polar.fromCoords(this.directionMin).azimuthInTurns;
                var wedgeAngleMax = wedgeAngleMin + this.angleSpannedInTurns;
                display.drawArc(drawPos, // center
                this.radiusInner, this.radiusOuter, wedgeAngleMin, wedgeAngleMax, this.colorFill, this.colorBorder);
            }
            // Clonable.
            clone() {
                return new VisualArc(this.radiusOuter, this.radiusInner, this.directionMin.clone(), this.angleSpannedInTurns, this.colorFill.clone(), (this.colorBorder == null ? null : this.colorBorder.clone()));
            }
            overwriteWith(other) {
                this.radiusOuter = other.radiusOuter;
                this.radiusInner = other.radiusInner;
                this.directionMin.overwriteWith(other.directionMin);
                this.angleSpannedInTurns = other.angleSpannedInTurns;
                this.colorFill.overwriteWith(other.colorFill);
                if (this.colorBorder != null) {
                    this.colorBorder.overwriteWith(other.colorBorder);
                }
                return this;
            }
            // Transformable.
            transform(transformToApply) {
                transformToApply.transformCoords(this.directionMin);
                return this;
            }
        }
        GameFramework.VisualArc = VisualArc;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
