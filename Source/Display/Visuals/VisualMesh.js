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
            draw(uwpe, display) {
                var entity = uwpe.entity;
                display.drawMeshWithOrientation(this.mesh, entity.locatable().loc.orientation);
            }
        }
        GameFramework.VisualMesh = VisualMesh;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
