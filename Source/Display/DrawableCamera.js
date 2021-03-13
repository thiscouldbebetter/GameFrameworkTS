"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class DrawableCamera extends GameFramework.EntityProperty {
            initialize(universe, world, place, entity) {
                var drawable = entity.drawable();
                var visual = drawable.visual;
                var visualTypeName = visual.constructor.name;
                if (visualTypeName != GameFramework.VisualCameraProjection.name) {
                    drawable.visual = new GameFramework.VisualCameraProjection(visual, (u, w) => w.placeCurrent.camera());
                }
            }
            // cloneable
            clone() {
                return this;
            }
        }
        GameFramework.DrawableCamera = DrawableCamera;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
