"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VisualPath {
            constructor(verticesAsPath, color, lineThickness, isClosed) {
                this.verticesAsPath = verticesAsPath;
                this.color = color;
                this.lineThickness = lineThickness;
                this.isClosed = isClosed;
                this.verticesAsPathTransformed = this.verticesAsPath.clone();
                this.transformTranslate = new GameFramework.Transform_Translate(GameFramework.Coords.create());
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
                var drawablePos = GameFramework.Locatable.of(entity).loc.pos;
                this.transformTranslate.displacement.overwriteWith(drawablePos);
                this.verticesAsPathTransformed.overwriteWith(this.verticesAsPath);
                GameFramework.Transforms.applyTransformToCoordsMany(this.transformTranslate, this.verticesAsPathTransformed.points);
                display.drawPath(this.verticesAsPathTransformed.points, this.color, this.lineThickness, this.isClosed);
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
        GameFramework.VisualPath = VisualPath;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
