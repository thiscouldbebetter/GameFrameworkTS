"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class MapLocated {
            constructor(map, loc) {
                this.map = map;
                this.loc = loc;
                this.box = new GameFramework.BoxAxisAligned(this.loc.pos, this.map.size);
                // Helper variables.
                this._boxTransformed = GameFramework.BoxAxisAligned.create();
            }
            static fromMap(map) {
                return new MapLocated(map, GameFramework.Disposition.default());
            }
            cellsInBox(box, cellsInBox) {
                var boxTransformed = this._boxTransformed.overwriteWith(box);
                boxTransformed.center.subtract(this.loc.pos).add(this.map.sizeHalf);
                var returnCells = this.map.cellsInBox(boxTransformed, cellsInBox);
                return returnCells;
            }
            // cloneable
            clone() {
                return new MapLocated(this.map, this.loc.clone());
            }
            overwriteWith(other) {
                this.loc.overwriteWith(other.loc);
                return this;
            }
            // Equatable.
            equals(other) { return false; } // todo
            // Transformable.
            coordsGroupToTransform() {
                return [this.loc.pos];
            }
            // ShapeBase.
            collider() { return null; }
            containsPoint(pointToCheck) {
                throw new Error("Not yet implemented!");
            }
            normalAtPos(posToCheck, normalOut) {
                return normalOut.overwriteWith(posToCheck).subtract(this.loc.pos).normalize();
            }
            pointRandom(randomizer) {
                return null; // todo
            }
            surfacePointNearPos(posToCheck, surfacePointOut) {
                return surfacePointOut.overwriteWith(posToCheck); // todo
            }
            toBoxAxisAligned(boxOut) { throw new Error("Not implemented!"); }
            // Transformable.
            transform(transformToApply) {
                transformToApply.transformCoords(this.loc.pos);
                return this;
            }
        }
        GameFramework.MapLocated = MapLocated;
        class MapLocated2 extends MapLocated {
            // hack - To allow different collision calculations.
            constructor(map, loc) {
                super(map, loc);
            }
            static fromMap(map) {
                return new MapLocated2(map, GameFramework.Disposition.default());
            }
            // Cloneable.
            clone() {
                return new MapLocated2(this.map, this.loc.clone());
            }
            overwriteWith(other) {
                this.loc.overwriteWith(other.loc);
                return this;
            }
        }
        GameFramework.MapLocated2 = MapLocated2;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
