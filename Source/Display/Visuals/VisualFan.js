"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VisualFan extends GameFramework.VisualBase {
            constructor(radius, angleStartInTurns, angleSpannedInTurns, colorFill, colorBorder) {
                super();
                this.radius = radius;
                this.angleStartInTurns = angleStartInTurns;
                this.angleSpannedInTurns = angleSpannedInTurns;
                this.colorFill = colorFill;
                this.colorBorder = colorBorder;
                // helper variables
                this._drawPos = GameFramework.Coords.create();
                this._polar = GameFramework.Polar.create();
            }
            static fromRadiusAndAnglesStartAndSpanned(radius, angleStartInTurns, angleSpannedInTurns) {
                return VisualFan.fromRadiusAnglesStartAndSpannedAndColorsFillAndBorder(radius, angleStartInTurns, angleSpannedInTurns, null, // colorFill
                GameFramework.Color.Instances().Cyan);
            }
            static fromRadiusAnglesStartAndSpannedAndColorsFillAndBorder(radius, angleStartInTurns, angleSpannedInTurns, colorFill, colorBorder) {
                return new VisualFan(radius, angleStartInTurns, angleSpannedInTurns, colorFill, colorBorder);
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
                var drawPos = this._drawPos.overwriteWith(drawableLoc.pos);
                var drawableAngleInTurns = drawableLoc.orientation.forward.headingInTurns();
                var wedgeAngleMin = drawableAngleInTurns + this.angleStartInTurns;
                var wedgeAngleMax = wedgeAngleMin + this.angleSpannedInTurns;
                display.drawArc(drawPos, // center
                0, this.radius, wedgeAngleMin, wedgeAngleMax, this.colorFill, this.colorBorder);
            }
            // Clonable.
            clone() {
                return new VisualFan(this.radius, this.angleStartInTurns, this.angleSpannedInTurns, this.colorFill.clone(), (this.colorBorder == null ? null : this.colorBorder.clone()));
            }
            overwriteWith(other) {
                this.radius = other.radius;
                this.angleStartInTurns = other.angleStartInTurns;
                this.angleSpannedInTurns = other.angleSpannedInTurns;
                this.colorFill.overwriteWith(other.colorFill);
                if (this.colorBorder != null) {
                    this.colorBorder.overwriteWith(other.colorBorder);
                }
                return this;
            }
            // Transformable.
            transform(transformToApply) {
                return this;
            }
        }
        GameFramework.VisualFan = VisualFan;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
