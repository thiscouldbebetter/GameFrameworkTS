"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VisualCrosshairs {
            constructor(numberOfLines, radiusOuter, radiusInner, color, lineThickness) {
                this.numberOfLines = numberOfLines || 4;
                this.radiusOuter = radiusOuter || 10;
                this.radiusInner = radiusInner || (this.radiusOuter / 2);
                this.color = color || GameFramework.Color.Instances().White;
                this.lineThickness = lineThickness || 1;
            }
            static fromRadiiOuterAndInner(radiusOuter, radiusInner) {
                return new VisualCrosshairs(null, radiusOuter, radiusInner, null, null);
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
                display.drawCrosshairs(GameFramework.Locatable.of(entity).loc.pos, this.numberOfLines, this.radiusOuter, this.radiusInner, this.color, this.lineThickness);
            }
            // Clonable.
            clone() {
                return new VisualCrosshairs(this.numberOfLines, this.radiusOuter, this.radiusInner, this.color, this.lineThickness);
            }
            overwriteWith(other) {
                this.numberOfLines = other.numberOfLines;
                this.radiusOuter = other.radiusOuter;
                this.radiusInner = other.radiusInner;
                this.color = other.color;
                this.lineThickness = other.lineThickness;
                return this;
            }
            // Transformable.
            transform(transformToApply) {
                return this; // todo
            }
        }
        GameFramework.VisualCrosshairs = VisualCrosshairs;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
