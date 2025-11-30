"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VisualPath extends GameFramework.VisualBase {
            constructor(verticesAsPath, color, lineThickness, isClosed) {
                super();
                this.verticesAsPath = verticesAsPath;
                this.color = color;
                this.lineThickness = lineThickness;
                this.isClosed = isClosed;
                this.verticesAsPathTransformed =
                    this.verticesAsPath.clone();
                this.transformTranslate =
                    Transform_Translate.fromDisplacement(Coords.create());
            }
            static fromPathColorAndThicknessOpen(verticesAsPath, color, lineThickness) {
                return new VisualPath(verticesAsPath, color, lineThickness, false);
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
                this.transformTranslate.displacement.overwriteWith(entityPos);
                this.verticesAsPathTransformed.overwriteWith(this.verticesAsPath);
                Transforms.applyTransformToCoordsMany(this.transformTranslate, this.verticesAsPathTransformed.points);
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
