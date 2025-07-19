"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Arc {
            constructor(shell, wedge) {
                this.shell = shell;
                this.wedge = wedge;
                this._collider = new GameFramework.ShapeGroupAll([
                    this.shell,
                    this.wedge
                ]);
            }
            static default() {
                return new Arc(GameFramework.Shell.default(), GameFramework.Wedge.default());
            }
            static fromShellAndWedge(shell, wedge) {
                return new Arc(shell, wedge);
            }
            center() {
                return this.shell.center();
            }
            // cloneable
            clone() {
                return new Arc(this.shell.clone(), this.wedge.clone());
            }
            overwriteWith(other) {
                this.shell.overwriteWith(other.shell);
                this.wedge.overwriteWith(other.wedge);
                return this;
            }
            // Equatable.
            equals(other) {
                var returnValue = (this.shell.equals(other.shell)
                    && this.wedge.equals(other.wedge));
                return returnValue;
            }
            // Transformable.
            coordsGroupToTransform() {
                return [this.shell.center(), this.wedge.vertex];
            }
            // ShapeBase.
            collider() {
                return this._collider;
            }
            containsPoint(pointToCheck) {
                throw new Error("Not yet implemented!");
            }
            normalAtPos(posToCheck, normalOut) {
                return this.shell.normalAtPos(posToCheck, normalOut);
            }
            pointRandom(randomizer) {
                return null; // todo
            }
            surfacePointNearPos(posToCheck, surfacePointOut) {
                return surfacePointOut.overwriteWith(posToCheck); // todo
            }
            toBoxAxisAligned(boxOut) {
                return this.shell.toBoxAxisAligned(boxOut);
            }
            // Transformable.
            transform(transformToApply) {
                throw new Error("Not implemented!");
            }
        }
        GameFramework.Arc = Arc;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
