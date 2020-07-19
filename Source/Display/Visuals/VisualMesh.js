"use strict";
class VisualMesh {
    constructor(mesh) {
        this.mesh = mesh;
    }
    // Cloneable.
    clone() {
        return new VisualMesh(this.mesh.clone());
    }
    ;
    overwriteWith(other) {
        var otherAsVisualMesh = other;
        this.mesh.overwriteWith(otherAsVisualMesh.mesh);
        return this;
    }
    ;
    // Transformable.
    transform(transformToApply) {
        transformToApply.transform(this.mesh);
        return this;
    }
    ;
    // Visual.
    draw(universe, world, display, entity) {
        display.drawMeshWithOrientation(this.mesh, entity.locatable().loc.orientation);
    }
    ;
}
