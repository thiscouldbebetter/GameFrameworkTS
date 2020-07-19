"use strict";
class VisualCameraProjection {
    constructor(child, cameraFactory) {
        this.child = child;
        this.cameraFactory = cameraFactory;
        // Helper variables.
        this._posSaved = new Coords(0, 0, 0);
    }
    draw(universe, world, display, entity) {
        var drawablePos = entity.locatable().loc.pos;
        this._posSaved.overwriteWith(drawablePos);
        var camera = this.cameraFactory(universe, world);
        camera.coordsTransformWorldToView(drawablePos);
        var isEntityInView = false;
        var boundable = entity.boundable();
        if (boundable == null) {
            isEntityInView = true;
        }
        else {
            var drawableCollider = boundable.bounds;
            var cameraViewCollider = camera.viewCollider;
            var collisionHelper = universe.collisionHelper;
            isEntityInView = collisionHelper.doCollidersCollide(drawableCollider, cameraViewCollider);
        }
        if (isEntityInView) {
            camera.entitiesInView.push(entity);
        }
        drawablePos.overwriteWith(this._posSaved);
    }
    ;
    drawImmediate(universe, world, display, entity) {
        var drawablePos = entity.locatable().loc.pos;
        this._posSaved.overwriteWith(drawablePos);
        var camera = this.cameraFactory(universe, world);
        camera.coordsTransformWorldToView(drawablePos);
        this.child.draw(universe, world, display, entity);
        drawablePos.overwriteWith(this._posSaved);
    }
    ;
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
