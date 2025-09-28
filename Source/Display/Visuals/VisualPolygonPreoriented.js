"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VisualPolygonPreoriented extends GameFramework.VisualBase {
            constructor(visualPolygonInner) {
                super();
                this.visualPolygonInner = visualPolygonInner;
            }
            static fromVisualPolygonInner(visualPolygonInner) {
                return new VisualPolygonPreoriented(visualPolygonInner);
            }
            static fromPathAndColorsFillAndBorder(verticesAsPath, colorFill, colorBorder) {
                var visualPolygonInner = GameFramework.VisualPolygon.fromPathAndColorsFillAndBorder(verticesAsPath, colorFill, colorBorder).shouldUseEntityOrientationSet(false);
                return new VisualPolygonPreoriented(visualPolygonInner);
            }
            // Clonable.
            clone() {
                return new VisualPolygonPreoriented(this.visualPolygonInner);
            }
            overwriteWith(other) {
                this.visualPolygonInner.overwriteWith(other.visualPolygonInner);
                return this;
            }
            // Transformable.
            transform(transformToApply) {
                this.visualPolygonInner.transform(transformToApply);
                return this;
            }
            // VisualBase.
            initialize(uwpe) {
                // Do nothing.
            }
            initializeIsComplete(uwpe) {
                return true;
            }
            draw(uwpe, display) {
                this.visualPolygonInner.draw(uwpe, display);
            }
        }
        GameFramework.VisualPolygonPreoriented = VisualPolygonPreoriented;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
