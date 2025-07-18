"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VisualCircle {
            constructor(radius, colorFill, colorBorder, borderThickness) {
                this.radius = radius;
                this.colorFill = colorFill;
                this.colorBorder = colorBorder;
                this.borderThickness = borderThickness || 1;
            }
            static default() {
                // Convenience method for rapid prototyping.
                return new VisualCircle(10, null, GameFramework.Color.Instances().Cyan, null);
            }
            static fromRadius(radius) {
                return VisualCircle.fromRadiusAndColorBorder(radius, GameFramework.Color.Instances().Cyan);
            }
            static fromRadiusAndColorBorder(radius, colorBorder) {
                return new VisualCircle(radius, null, colorBorder, null);
            }
            static fromRadiusAndColorFill(radius, colorFill) {
                return new VisualCircle(radius, colorFill, null, null);
            }
            static fromRadiusAndColors(radius, colorFill, colorBorder) {
                return new VisualCircle(radius, colorFill, colorBorder, null);
            }
            static fromRadiusColorBorderAndThickness(radius, colorBorder, borderThickness) {
                return new VisualCircle(radius, null, colorBorder, borderThickness);
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
                var drawPos = entityPos;
                display.drawCircle(drawPos, this.radius, this.colorFill, this.colorBorder, this.borderThickness);
            }
            // Clonable.
            clone() {
                return new VisualCircle(this.radius, this.colorFill, this.colorBorder, this.borderThickness);
            }
            overwriteWith(other) {
                this.radius = other.radius;
                this.colorFill = other.colorFill;
                this.colorBorder = other.colorBorder;
                this.borderThickness = other.borderThickness;
                return this; // todo
            }
            // Transformable.
            transform(transformToApply) {
                return this; // todo
            }
        }
        GameFramework.VisualCircle = VisualCircle;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
