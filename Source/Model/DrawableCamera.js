"use strict";
class DrawableCamera extends EntityProperty //<DrawableCamera>
 {
    initialize(universe, world, place, entity) {
        var drawable = entity.drawable();
        var visual = drawable.visual;
        var visualTypeName = visual.constructor.name;
        if (visualTypeName != VisualCameraProjection.name) {
            drawable.visual = new VisualCameraProjection(visual, (u, w) => w.placeCurrent.camera());
        }
    }
    ;
    // cloneable
    clone() {
        return this;
    }
}
