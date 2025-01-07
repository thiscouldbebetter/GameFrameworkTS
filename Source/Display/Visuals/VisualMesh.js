"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VisualMesh {
            constructor(mesh) {
                this.mesh = mesh;
            }
            // Cloneable.
            clone() {
                return new VisualMesh(this.mesh.clone());
            }
            overwriteWith(other) {
                this.mesh.overwriteWith(other.mesh);
                return this;
            }
            // Transformable.
            transform(transformToApply) {
                transformToApply.transform(this.mesh);
                return this;
            }
            // Visual.
            initialize(uwpe) {
                // Do nothing.
            }
            draw(uwpe, display) {
                var entity = uwpe.entity;
                display.drawMeshWithOrientation(this.mesh, GameFramework.Locatable.of(entity).loc.orientation);
            }
        }
        GameFramework.VisualMesh = VisualMesh;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
