"use strict";
class Shell {
    constructor(sphereOuter, radiusInner) {
        this.sphereOuter = sphereOuter;
        this.radiusInner = radiusInner;
        this.sphereInner = new Sphere(this.sphereOuter.center, this.radiusInner);
        this._collider = new ShapeGroupAll([
            this.sphereOuter,
            new ShapeInverse(new ShapeContainer(this.sphereInner))
        ]);
    }
    center() {
        return this.sphereOuter.center;
    }
    collider() {
        return this._collider;
    }
    // cloneable
    clone() {
        return new Shell(this.sphereOuter.clone(), this.radiusInner);
    }
    overwriteWith(other) {
        this.sphereOuter.overwriteWith(other.sphereOuter);
        this.radiusInner = other.radiusInner;
        return this;
    }
    // ShapeBase.
    locate(loc) {
        return ShapeHelper.Instance().applyLocationToShapeDefault(loc, this);
    }
    normalAtPos(posToCheck, normalOut) {
        var displacementFromCenter = normalOut.overwriteWith(posToCheck).subtract(this.center());
        var distanceFromCenter = displacementFromCenter.magnitude();
        var distanceFromSphereOuter = Math.abs(distanceFromCenter - this.sphereOuter.radius);
        var distanceFromSphereInner = Math.abs(distanceFromCenter - this.sphereInner.radius);
        // Note that normalOut == displacementFromCenter.
        if (distanceFromSphereInner < distanceFromSphereOuter) {
            normalOut.invert();
        }
        normalOut.normalize();
        return normalOut;
    }
    surfacePointNearPos(posToCheck, surfacePointOut) {
        return surfacePointOut.overwriteWith(posToCheck); // todo
    }
}
